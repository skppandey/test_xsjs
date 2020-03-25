$.response.headers.set("Access-Control-Allow-Origin", "*");
$.response.status = $.net.http.OK;
$.response.contentType = "application/text";
var body = '';
var aCmd = $.request.parameters.get('data');
var obj = JSON.parse(aCmd);
var id = obj.ID;
var iname = obj.Name;
var company = obj.Company;
var city = obj.City;
var tx_data_query = "";
function getTxtData() {
	var connection = $.db.getConnection();
	var statement = null;
	var resultSet = null;
	tx_data_query = ('INSERT INTO "TEST"."EMPLOYEE" VALUES (?,?,?,?)');
// 		tx_data_query = 'INSERT INTO "TEST"."EMPLOYEE" ("ID", "NAME", "COMPANY", "CITY") VALUES ('+id+','+iname+','+company+','+city+')';
	try {
			statement = connection.prepareStatement(tx_data_query);
		for(var i=0;i<obj.length;i++){
		statement.setInteger(1, obj[i].ID);
		statement.setString(2, obj[i].Name);
		statement.setString(3, obj[i].Company);
		statement.setString(4, obj[i].City);
		}
	resultSet = statement.execute();	
// 		resultSet = connection.execute(tx_data_query);
		connection.commit();
	} finally {
		statement.close();
		connection.close();
	}
	return resultSet;
}

function doGet() {
	try {
		$.response.contentType = "application/json";
		$.response.contentType = "text/plain";
		$.response.setBody(getTxtData());
	} catch (err) {
		$.response.contentType = "text/plain";
		$.response.setBody("Error while executing query: [" + err.message + "]");
		$.response.returnCode = 200;
	}
}
doGet();