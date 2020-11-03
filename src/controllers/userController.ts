import { Request, Response } from 'express';
import Joi = require('joi');
import { insufficientParameters, mongoError, successResponse, failureResponse } from '../modules/common/service';
import { IUser } from '../modules/user/model';
import UserService from '../modules/user/service';

export class UserController {

    private user_service: UserService = new UserService();

    public create_user(req: Request, res: Response) {
        // this check whether all the filds were send through the erquest or not
        if (this.validateCreateUser(req.body)) {
            const user_params: IUser = {
                name: {
                    first_name: req.body.name.first_name,
                    middle_name: req.body.name.middle_name,
                    last_name: req.body.name.last_name
                },
                email: req.body.email,
                phone_number: req.body.phone_number,
                gender: req.body.gender,
                modification_notes: [{
                    modified_on: new Date(Date.now()),
                    modified_by: null,
                    modification_note: 'New user created'
                }]
            };
            this.user_service.createUser(user_params, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('create user successfull', user_data, res);
                }
            });
        } else {
            // error response if some fields are missing in request body
            insufficientParameters(res);
        }
    }

    public get_user(req: Request, res: Response) {
        if (req.params.id) {
            const user_filter = { _id: req.params.id };
            this.user_service.filterUser(user_filter, (err: any, user_data: IUser) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('get user successfull', user_data, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public update_user(req: Request, res: Response) {
        if (req.params.id && this.validateUpdateUser(req.body)) {
            const user_filter = { _id: req.params.id };
            this.user_service.filterUser(user_filter, (err: any, user_data) => {
                if (err) {
                    mongoError(err, res);
                } else if (user_data) {
                    user_data.modification_notes.push({
                        modified_on: new Date(Date.now()),
                        modified_by: null,
                        modification_note: 'User data updated'
                    });
                    const user_params: IUser = {
                        // just get document of object user_data
                        ...user_data._doc,
                        ...req.body,
                        _id: req.params.id,
                        name: req?.body?.name ? {
                            ...user_data.name,
                            ...req.body.name,
                        } : user_data.name,
                        modification_notes: user_data.modification_notes
                    };
                    this.user_service.updateUser(user_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('update user successfull', null, res);
                        }
                    });
                } else {
                    failureResponse('invalid user', null, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public delete_user(req: Request, res: Response) {
        if (req.params.id) {
            this.user_service.deleteUser(req.params.id, (err: any, delete_details) => {
                if (err) {
                    mongoError(err, res);
                } else if (delete_details.deletedCount !== 0) {
                    successResponse('delete user successfull', delete_details, res);
                } else {
                    failureResponse('invalid user', null, res);
                }
            });
        } else {
            insufficientParameters(res);
        }
    }

    public validateCreateUser(body: IUser) {
        const schema = Joi.object({
            name: Joi.object({
                first_name: Joi.string().required(),
                middle_name: Joi.string().required(),
                last_name: Joi.string().required(),
            }).required(),
            email: Joi.string().email().required(),
            phone_number: Joi.string().required(),
            gender: Joi.string().required(),
        })
        try {
            const value = schema.validate(body);
            return value
            
        }
        catch (err) {
            throw err
         }
    }

    public validateUpdateUser(body: IUser) {
        const schema = Joi.object({
            name: Joi.object({
                first_name: Joi.string(),
                middle_name: Joi.string(),
                last_name: Joi.string(),
            }),
            email: Joi.string().email(),
            phone_number: Joi.string(),
            gender: Joi.string(),
        })
        try {
            const value = schema.validate(body);
            return value
            
        }
        catch (err) {
            throw err
         }
    }
}