require("dotenv").config();

const express = require("express");
const {leerTareas,nuevaTarea} = require("./db");
const servidor = express();
servidor.use(express.json());//va a convertir en objeto cualquier json y lo almacena en el body

if(process.env.PRUEBAS){
    servidor.use("/pruebas",express.static("./pruebas"));
}

servidor.get("/tareas",async (peticion,respuesta) => {
    try{
        let tareas= await leerTareas();

        respuesta.json(tareas);//json resibe el objeto de las tareas

    }catch(error){
        respuesta.status(500);
        respuesta.json({error:"error en el servidor"});



    }

});
servidor.post("/tareas/nueva",async(peticion,respuesta,siguiente)=>{
   let {tarea} = peticion.body;
   if(tarea && tarea.trim() != ""){
       try{
        let id=await nuevaTarea(tarea);
        return respuesta.json({id});

       }catch(error){

        respuesta.status(500);
        return respuesta.json({error:"error en el servidor"});


       }
   }

   siguiente({error:"no tiene la propiedad TAREA"});
    
});
servidor.delete("/tareas/borrar/:id",(peticion,respuesta)=>{
    respuesta.send(`borraremos id ---> ${peticion.params.id}`);
});


servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({error:"error en la petición"});

});




servidor.listen(process.env.PORT);