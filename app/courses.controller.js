const sql = require("./dbconfig.js");
const CourseObject = require('./Course');
const studentController = require('./students.controller');

//find courses by search criteria
exports.findCourses=(request,response)=>{
    //creating query string and sanitizing and validating input
    queryStr = request.query;
    var queryParam = "";
    var sqlStatement = "" ;
    
    if(queryStr.id){
        queryParam = "where c_id="+queryStr.id;
        request.checkQuery('id','Invalid id').isInt().trim().escape();
    }
    if(queryStr.courseName){
        if(queryParam){
            queryParam = queryParam.concat(" AND c_name='",queryStr.courseName,"'");
        }
        else{
            queryParam = "where c_name='"+queryStr.courseName+"'";
        }
    }

    sqlStatement = "select * from courses "+queryParam;

    var errors = request.validationErrors();

    if(!errors){
        //sql query to get courses by search criteria
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
                //send result
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
};