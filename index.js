require("dotenv").config();

const express = require("express");
const cors = require("cors");
const {leerTareas,nuevaTarea,borrarTarea,actualizarEstado,actualizarTexto} = require("./db");
const servidor = express();


servidor.use(cors());

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

        respuesta.status(201);
        return respuesta.json({id});

       }catch(error){

        respuesta.status(500);
        return respuesta.json({error:"error en el servidor"});


       }
   }

   siguiente({error:"no tiene la propiedad TAREA"});
    
});
servidor.put("/tareas/actualizar/:operacion(1|2)/:id([0-9]+)",async(peticion,respuesta,siguiente) =>{
     let operaciones = [actualizarTexto,actualizarEstado];

     let {id,operacion} = peticion.params;

     operacion = Number(operacion);

     let {tarea} = peticion.body;

     if(operacion == 1 && (!tarea || tarea.trim() =="")){
        return siguiente({error :"no tiene la propiedad TAREA"});
     }
     try{

        let cantidad = await operaciones [operacion - 1](id, operacion == 1 ? tarea : null);
        return respuesta.json({resultado : cantidad ? "ok" : "ko" });
     }catch(error){
        respuesta.status(500);
        return respuesta.json({error:"error en el servidor"});
     }

   
});


servidor.delete("/tareas/borrar/:id([0-9]+)",async(peticion,respuesta)=>{
    try{
        let cantidad = await borrarTarea(peticion.params.id);

       
        respuesta.json({resultado : cantidad ? "ok" : "ko"});

       }catch(error){

        respuesta.status(500);
        respuesta.json({error:"error en el servidor"});
       }

});


servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({error:"error en la petición"});

});

servidor.use((peticion,respuesta)=>{
    respuesta.status(404);
    respuesta.json({error:"recurso no encontrado"});
});




servidor.listen(process.env.PORT);