$.response.headers.set("Access-Control-Allow-Origin", "*");
$.response.status = $.net.http.OK;
$.response.contentType = "application/text";
var body='';
var aCmd = $.request.parameters.get('ID');
var filterData = JSON.parse($.request.parameters.get('filterData'));
var pstmt = 'SELECT * FROM TEST.EMPLOYEE WHERE ID IN ('+filterData.ID+')';
// "ID" = \'' + filterData.ID + '\'
function close(closables) {
          var closable;
          var i;
          for (i = 0; i < closables.length; i++) {
                    closable = closables[i];
                    if(closable) {
                              closable.close();
                    }
          }
}

function getTxData(){
          var txlist = [];
          var connection = $.db.getConnection();
          var statement = null;
          var resultSet = null;
          try{
                    statement = connection.prepareStatement(pstmt);
                    // statement.setString(1, filterData.ID[0]);
                    // statement.setString(2, filterData.ID[1]);
                    resultSet = statement.executeQuery();
                    var txitem;
         
                    while (resultSet.next()) {
                    txitem = {};
                    txitem.ID = resultSet.getInteger(1);
                    txitem.Name = resultSet.getString(2);
                    txitem.Company = resultSet.getString(3);
                    txitem.City = resultSet.getString(4);
                    txlist.push(txitem);
                    }
          } finally {
                    close([resultSet, statement, connection]);
          }
          return txlist;
}

function doGet() {
    
          try{
                    $.response.contentType = "text/plain";
                    $.response.setBody(JSON.stringify(getTxData()));
          }
          catch(err){
                    $.response.contentType = "text/plain";
                    $.response.setBody("Error while executing query: [" + err.message + "]");
                    $.response.returnCode = 200;
          }
}
doGet();