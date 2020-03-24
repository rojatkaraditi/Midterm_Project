const sql = require("./dbconfig.js");
const CourseObject = require('./Course');
const studentController = require('./students.controller');

exports.findCourses=(request,response)=>{
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
        sql.query(sqlStatement,(err,res)=>{
            if(err){
                var result = {
                    'error': err,
                    'links':studentController.getLinks()
                }
                response.status(500).json(result);
            }
            else if(res.length>0){
                var courseObjects = [];
                    res.forEach(course=>{
                        courseObjects.push(new CourseObject(course));
                    });
                    var result = {
                        "courses": courseObjects,
                        "links": studentController.getLinks()
                    }
                response.status(200).json(result);
            }
            else{
                var result = {
                    "courses":[],
                    "links": studentController.getLinks()
                }
                response.status(200).json(result);
            }
        });
    }
    else{
        var result = {
            'error': errors,
            'links':studentController.getLinks()
        }
        response.status(400).json(result);
    }
};