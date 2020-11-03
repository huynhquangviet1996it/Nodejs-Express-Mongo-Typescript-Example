db.createUser({
    user: "username",
    pwd: "password",
    roles: [
        {
            role: "readWrite",
            db: "db_test_project_local"
        },
        {
            role: "readWrite",
            db: "db_test_project_dev"
        },
        {
            role: "readWrite",
            db: "db_test_project_qa"
        },
        {
            role: "readWrite",
            db: "db_test_project_prod"
        }
    ]
})