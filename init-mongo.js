db.createUser({
    user: "username",
    pwd: "password",
    roles: [
        {
            role: "readWrite",
            db: "db_test_project_local"
        }
    ]
})