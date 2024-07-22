require("dotenv").config();
const postgres = require("postgres");

function conectar(){
    return postgres({
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD
         
    });//CONFIGURA EL OBJETO POSTGRES Y NOS LO PASA
}

//FUNCIONES QUE SE ENCARGAN DE INTERACTUAR CON LA BASE DE DATOS
function leerTareas(){
    return new Promise(async (ok,ko)=>{
        const conexion = conectar();//se conecta
            try{ //empieza a buscar las tareas
                
                let tareas =await conexion `SELECT * FROM tareas`
                conexion.end();
                ok(tareas);

            }catch(error){ //si falla, la rechaza
                ko({error : "error en base de datos"});

            }
        ;
    });
}

function nuevaTarea(tarea){
    return new Promise(async (ok,ko)=>{
        const conexion = conectar();//se conecta
            try{ 
                
                
                let [{id}] =await conexion `INSERT INTO tareas (tarea) VALUES (${tarea}) RETURNING id `;
                conexion.end();

                ok(id);

            }catch(error){ //si falla, la rechaza
                ko({error : "error en base de datos"});

            }
        ;
    });
}


function borrarTarea(id){
    return new Promise(async (ok,ko)=>{
        const conexion = conectar();//se conecta
            try{ 
                
                
                let {count} =await conexion `DELETE FROM tareas WHERE id = ${id}`;
                conexion.end();
                ok(count);

            }catch(error){ //si falla, la rechaza
                ko({error : "error en base de datos"});

            }
        ;
    });
}

function actualizarEstado(id){
    return new Promise(async (ok,ko)=>{
        const conexion = conectar();//se conecta
            try{ 
                
                
                let {count} =await conexion `UPDATE tareas SET terminada = NOT terminada  WHERE id = ${id}`;
                conexion.end();
                ok(count);

            }catch(error){ //si falla, la rechaza
                ko({error : "error en base de datos"});

            }
        ;
    });
}
function actualizarTexto(id,texto){
    return new Promise(async (ok,ko)=>{
        const conexion = conectar();//se conecta
            try{ 
                
                
                let {count} =await conexion `UPDATE tareas SET tarea = ${texto}  WHERE id = ${id}`;
                conexion.end();
                ok(count);

            }catch(error){ //si falla, la rechaza
                ko({error : "error en base de datos"});

            }
        ;
    });
}


/*leerTareas()
.then(x => console.log(x))
.catch(x => console.log(x))



nuevaTarea ("aprender React")
.then (x => console.log(x))
.catch (x => console.log(x));

nuevaTarea("otra tarea")
.then (x => console.log(x))
.catch (x => console.log(x));*/

/*actualizarEstado(1)
.then(x =>console.log(x))*/

/*leerTareas(4,"un nuevo texto")
.then(x =>console.log(x))*/






module.exports ={leerTareas,nuevaTarea,borrarTarea,actualizarEstado,actualizarTexto};
