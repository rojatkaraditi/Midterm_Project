const sql = require("./dbconfig.js");
const DepartmentObject = require('./Department');
const studentController = require('./students.controller');

//find departments by search criteria
exports.findDepartments=(request,response)=>{
    //creating query string and inout sanitization and validation
    queryStr = request.query;
    var queryParam = "";
    var sqlStatement = "" ;
    
    if(queryStr.id){
        queryParam = "where d_id="+queryStr.id;
        request.checkQuery('id','Invalid id').isInt().trim().escape();
    }
    if(queryStr.departmentName){
        if(queryParam){
            queryParam = queryParam.concat(" AND d_name='",queryStr.departmentName,"'");
        }
        else{
            queryParam = "where d_name='"+queryStr.departmentName+"'";
        }
    }

    sqlStatement = "select * from departments "+queryParam;

    var errors = request.validationErrors();

    if(!errors){
        //sql query to get departments according to criteria
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
                var departmentObjects = [];
                    res.forEach(department=>{
                        departmentObjects.push(new DepartmentObject(department));
                    });
                    var result = {
                        "department": departmentObjects,
                        "links": studentController.getLinks()
                    }
                    //send response
                response.status(200).json(result);
            }
            else{
                //data transformation
                var result = {
                    "departments":[],
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
};