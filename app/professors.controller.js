const sql = require("./dbconfig.js");
const ProfessorObject = require("./Professor.js");
const CourseObject = require('./Course.js');
const studentController = require('./students.controller');

//search professors according to search criteria
exports.findProfessors=(request,response)=>{
    //building query string and inout sanitazing and validation
    queryStr = request.query;
    var queryParam = "";
    var sqlStatement = "" ;
    
    if(queryStr.id){
        queryParam = "where p_id="+queryStr.id;
        request.checkQuery('id','Invalid id').isInt().trim().escape();
    }
    if(queryStr.departmentId){
        if(queryParam){
            queryParam = queryParam.concat(" AND p.d_id=",queryStr.departmentId);
        }
        else{
            queryParam = "where p.d_id="+queryStr.departmentId;
        }
        request.checkQuery('departmentId','Invalid departmentId').isInt().trim().escape();
    }
    if(queryStr.firstName){
        if(queryParam){
            queryParam = queryParam.concat(" AND first_name='",queryStr.firstName,"'");
        }
        else{
            queryParam = "where first_name='"+queryStr.firstName+"'";
        }
        request.checkQuery('firstName','Invalid firstName').isAlpha().trim().escape();
    }
    if(queryStr.lastName){
        if(queryParam){
            queryParam = queryParam.concat(" AND last_name='",queryStr.lastName,"'");
        }
        else{
            queryParam = "where last_name='"+queryStr.lastName+"'";
        }
        request.checkQuery('lastName','Invalid lastName').isAlpha().trim().escape();
    }
    if(queryStr.dateOfBirth){
        if(queryParam){
            queryParam = queryParam.concat(" AND date_of_birth='",queryStr.dateOfBirth,"'");
        }
        else{
            queryParam = "where date_of_birth='"+queryStr.dateOfBirth+"'";
        }
        request.checkQuery('dateOfBirth','Invalid dateOfBirth').isValidDate();
    }
    if(queryStr.phoneNumber){
        if(queryParam){
            queryParam = queryParam.concat(" AND phone_number='",queryStr.phoneNumber,"'");
        }
        else{
            queryParam = "where phone_number='"+queryStr.phoneNumber+"'";
        }
        request.checkQuery('phoneNumber','Invalid phoneNumber').isNumeric().isLength({min:10,max:13}).trim().escape();
    }
    if(queryStr.address){
        if(queryParam){
            queryParam = queryParam.concat(" AND address='",queryStr.address,"'");
        }
        else{
            queryParam = "where address='"+queryStr.address+"'";
        }
    }
        sqlStatement = "select p_id,d.d_name as department_name,first_name,last_name,date_of_birth,phone_number,address from professors p join departments d using (d_id) "+queryParam;

        var errors = request.validationErrors();
        if(!errors){
            //sql query to search professors as per search parameters
            sql.query(sqlStatement,(err,res)=>{
                if(err){
                    //data transformation
                    var result = {
                        'error': err,
                        'links':studentController.getLinks()
                    }
                    //send response
                    response.status(500).json(result);
                }
                else if(res.length>0){
                    //data transformation
                    var professorObjects = [];
                    res.forEach(professor=>{
                        professorObjects.push(new ProfessorObject(professor));
                    });
                    var result = {
                        "professors": professorObjects,
                        "links": studentController.getLinks()
                    }
                    //send response
                    response.status(200).json(result);
                }
                else{
                    //data transformation
                    var result = {
                        "professors":[],
                        "links": studentController.getLinks()
                    }
                    //send response
                    response.status(200).json(result);
                }
            });
        }
        else{
            //date transformation
            var result = {
                'error': errors,
                'links':studentController.getLinks()
            }
            //send response
            response.status(400).json(result);
        }
};

//search courses taught by professors
exports.findProfessorCourses = (request,response) =>{
    //input sanitazing and validation
    request.checkParams('id','Invalid professor id').isInt().trim().escape();

    var errors = request.validationErrors();

    if(!errors){
        var professor_id = request.params.id;
        //sql query to search for professor courses
        sql.query('select pc.c_id,c.c_name from professors_courses pc join courses c using (c_id) where p_id='+professor_id,(err,res)=>{
            if(err){
                //data transformation
                var result = {
                    'error': err,
                    'links':studentController.getLinks()
                }
                //send response
                response.status(500).json(result);
            }
            else if(res.length>0){
                //data transformation
                var courseObjects = [];
                    res.forEach(course=>{
                        courseObjects.push(new CourseObject(course));
                    });
                    var result = {
                        "courses": courseObjects,
                        "links": studentController.getLinks()
                    }
                    //send response
                response.status(200).json(result);
            }
            else{
                //data transformation
                var result = {
                    "courses":[],
                    "links": studentController.getLinks()
                }
                //send response
                response.status(200).json(result);
            }
        });
    }
    else{
        //data transformation
        var result = {
            'error': errors,
            'links':studentController.getLinks()
        }
        //send response
        response.status(400).json(result);
    }
}