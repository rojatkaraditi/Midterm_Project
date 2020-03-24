const sql = require("./dbconfig.js");
const DepartmentObject = require('./Department');
const studentController = require('./students.controller');

exports.findDepartments=(request,response)=>{
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
        sql.query(sqlStatement,(err,res)=>{
            if(err){
                var result = {
                    'error': err,
                    'links':studentController.getLinks()
                }
                response.status(500).json(result);
            }
            else if(res.length>0){
                var departmentObjects = [];
                    res.forEach(department=>{
                        departmentObjects.push(new DepartmentObject(department));
                    });
                    var result = {
                        "department": departmentObjects,
                        "links": studentController.getLinks()
                    }
                response.status(200).json(result);
            }
            else{
                var result = {
                    "departments":[],
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