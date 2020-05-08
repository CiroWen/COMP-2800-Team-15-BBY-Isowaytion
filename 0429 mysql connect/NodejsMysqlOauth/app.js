const express = require(`express`)
const app = express()
const mysql = require(`mysql`)

//connection for db. google `mpm mysql` for more info
const db = mysql.createConnection({
    host     : 'localhost',
    //where the info is hoste
    user     : 'root',
    //the user name of db
    password : 'isowaytion15',
    //the pswd for user
    database : 'isowaytion'
    //name of db
  });

  //initial connection
  db.connect((err) =>{
      if(err){
          throw err;
    }
      console.log('db is connected');
      //ciro is connected
  });



app.get(`/tabletable`, (req,res) =>{
    let query1 = 'CREATE TABLE c1(id int AUTO_INCREMENT, Name VARCHAR(100), Email VARCHAR(100), Address VARCHAR(100), PRIMARY KEY (id))'
    db.query(query1, (err,result) =>{
        if(err) {console.log(err.sqlMessage);
        //prompting the sql err msg
        console.log(err);
        res.send(`<p>fail to create table</p><p>db feedback:${err.sqlMessage}`)}
        //you can see all the err msg here. so up above err.sqlMessage is used.
        else {console.log(result);
        res.send(`table created`);
    }
    })
})


  //simple sql query to fetch the data from db.
  //here is just using the system table as a calculator.
  db.query(`SELECT 1+1 AS solution`, (err,results,fileds)=>{
      if(err) console.log('error');
      //
      console.log(results);
      console.log(results[0].solution);
      
  })

app.get('/',(req,res)=>{
    res.send('<h2>hello</h2>')
})

//creating a user in our database.
app.get('/usercreating', (req,res)=>{
    let value ={Email:'33333', Name:'ciro', Address:'metrotown'}
    let sql ='insert into c1 set ?'
    let query = db.query(sql, value, (err, result)=>{
        if(err){
            console.log(`err occured ${err}`);
        }
        else{
            res.send('created')
        }
    })
})

db.query(`select email from c1 WHERE Name = \"ciro\"`, (err,results)=>{
    console.log(results);
    // console.log(results[0].Email);
    
})



// app.listen('1515', ()=>{
//     console.log('Ciro is listening again on 1515, ctrl + c to escape, visit localhost:1515 to test');
    
// })