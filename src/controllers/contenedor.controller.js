import {getConnection,sql} from '../database/conexion.js';
import {ruta} from '../app.js';
import {queries} from '../database/query.js';
import path from 'path';
import { Console } from 'console';
export let result = '';
export let agendamiento = '';
export let login = '';
export let pass = '';
export let listado = '';
export let IDEQUIPOANTES = '';
export let paginaWeb = '';


/*export const getProveedor = async (req,res) => {
    
    
    const {id} = req.params;    
    const pool = await getConnection()
    result = await pool.request().
    input("DOCUMENTO",sql.VarChar,id).
    query(queries.allProveedor);

    console.log("getProveedor"+id);
    res.send(result);
    //res.redirect('/cliente/'+id); 
                
}*/


export const viewClient = async (req,res) => {
    try
    {
        login = req.body.LOGIN;        
        pass = req.body.PASSWORD;
        const pool = await getConnection();
        result = await pool.request().
        input("LOGIN",sql.VarChar,login).
        input("PASS",sql.VarChar,pass).
        input("STAT",sql.VarChar,"ACTIVO").
        query(queries.usuario); 

        if (result.rowsAffected > 0)
        {

            res.redirect(paginaWeb+'/inicio'); 
        }
        else
        {                       
            res.redirect(paginaWeb+'/');           
        }
    }
    catch (error)
    {
        res.status(500)
        res.send(error.message)
    }
}

export const listContenedor = async (req,res) => {
    try
    {            

        console.log('entre');
        const pool = await getConnection();
        const prestamos = await pool.request().        
        input("DEVUELTO",sql.VarChar,"NO").
        query(queries.prestamoEquipos);                         
        const devuletos = await pool.request().        
        input("DEVUELTO",sql.VarChar,"SI").
        query(queries.prestamoEquipos);   
        const asuntoEntrega = await pool.request().
        query(queries.asuntoEntrega);        
        res.render(path.join(ruta+'/view/prestamos.ejs'),({usuario : prestamos.recordset,devuelto: devuletos.recordset,asuntoEntrega : asuntoEntrega.recordset}));        
    }
    catch (error)
    {
        res.status(500)
        res.send(error.message)
    }
}

export const newAgendamiento = async (req,res) => {
    try
    {        
        const pool = await getConnection();        
        listado = await pool.request().                
        input("STAT",sql.VarChar,"ACTIVO").
        input("PRESTADO",sql.VarChar,"NO").
        query(queries.listadoEquipos);
        const cliente = await pool.request().
        query(queries.cliente);
        const documentosGarantais = await pool.request().
        query(queries.documentosGarantias);
        const asuntoEntrega = await pool.request().
        query(queries.asuntoEntrega);

        if (result.rowsAffected >  0)
        {
            res.render(path.join(ruta+'/view/new.ejs'),({listado : listado.recordset,cliente : cliente.recordset,documentosGarantias : documentosGarantais.recordset,asuntoEntrega:asuntoEntrega.recordset}));
        }
        else
        {              
            res.redirect(paginaWeb+'/inicio');         
        }
    }
    catch (error)
    {
        res.status(500)
        res.send(error.message)
    }
}


export const crearAgendamiento = async (req,res) => {
    try
    {
        
        const IDCLIENTE = req.body.IDCLIENTE;
        const DOCUMENTO = req.body.DOCUMENTO;
        const NOMBRECOMPLETO = req.body.NOMBRE1;
        const IDEQUIPO = req.body.IDEQUIPO;
        const EQUIPO = req.body.EQUIPO;
        const SERIAL = req.body.SERIAL;
        let FECHAENTREGA = req.body.FECHAENTREGA;
        const IDDOCUMENTOGARANTIA = req.body.IDDOCUMENTOGARANTIA;
        const DOCUMENTOGARANTIA = req.body.DOCUMENTOGARANTIA;
        const IDOBSERVACIONENTREGA = req.body.IDOBSERVACIONENTREGA;
        const OBSERVACIONENTREGA = req.body.OBSERVACIONENTREGA;
        const OBSERVACIONESDEENTREGA = req.body.OBSERVACIONESDEENTREGA;
        const DEVUELTO = 'NO';
        const USUARIOCREA = result.recordset[0].NOMBRECOMPLETO;    
        const USUARIOENTREGA = result.recordset[0].NOMBRECOMPLETO;                                
        const PRESTADO = 'SI';
        FECHAENTREGA = FECHAENTREGA + " 01:00.000";        
        
        const pool = await getConnection();        
        const nuevo = await pool.request()
        .input("IDCLIENTE",sql.Numeric,IDCLIENTE)
        .input("DOCUMENTO",sql.VarChar,DOCUMENTO)
        .input("NOMBRECOMPLETO",sql.VarChar,NOMBRECOMPLETO)
        .input("IDEQUIPO",sql.Numeric,IDEQUIPO)
        .input("EQUIPO",sql.VarChar,EQUIPO)            
        .input("SERIAL",sql.VarChar,SERIAL)
        .input("FECHAENTREGA",sql.DateTime,FECHAENTREGA)
        .input("IDDOCUMENTOGARANTIA",sql.Numeric,IDDOCUMENTOGARANTIA)
        .input("DOCUMENTOGARANTIA",sql.VarChar,DOCUMENTOGARANTIA)              
        .input("IDOBSERVACIONENTREGA",sql.Numeric,IDOBSERVACIONENTREGA)            
        .input("OBSERVACIONENTREGA",sql.VarChar,OBSERVACIONENTREGA)            
        .input("OBSERVACIONESDEENTREGA",sql.VarChar,OBSERVACIONESDEENTREGA)        
        .input("DEVUELTO",sql.VarChar,DEVUELTO)
        .input("USUARIOCREA",sql.VarChar,USUARIOCREA)
        .input("USUARIOENTREGA",sql.VarChar,USUARIOENTREGA)                    
        .input("PRESTADO",sql.VarChar,PRESTADO)                                  
        .query(queries.crearPrestamo);
        
        await pool.request()
        .input("PRESTADO",sql.VarChar,'SI')
        .input("IDLISTADOEQUIPO",sql.Numeric,IDEQUIPO)
        .query(queries.actualizarEquipo);
        
        res.redirect(paginaWeb+'/inicio');
              
                         
                 
    }
    catch (error)
    {
        res.status(500)
        res.send(error.message)
    }    
}

export const seleccionEquipo = async (req,res)=> {
    try
    {
        const {id} = req.params;
        

        const pool = await getConnection();
        const equipos = await pool.request()
        .input("ID",sql.Int,id)
        .query(queries.equipoSeleccionado);
        listado = await pool.request().                
        input("STAT",sql.VarChar,"ACTIVO").
        input("PRESTADO",sql.VarChar,"NO").
        query(queries.listadoEquipos);
        const cliente = await pool.request().
        query(queries.cliente);
        const documentosGarantais = await pool.request().
        query(queries.documentosGarantias);
        const asuntoEntrega = await pool.request().
        query(queries.asuntoEntrega);

        IDEQUIPOANTES = equipos.recordset[0].IDEQUIPO;

        res.render(path.join(ruta+'/view/edit.ejs'),{equipos : equipos.recordset[0],listado : listado.recordset,cliente : cliente.recordset,documentosGarantias : documentosGarantais.recordset,asuntoEntrega:asuntoEntrega.recordset});
    }    
    catch (error)
    {
        res.status(500)
        res.send(error.message)
    }
}

export const actualizarPrestamo = async (req,res) => {
    try
    {
        const id = req.body.IDPRESTAMOEQUIPOS;
        const IDCLIENTE = req.body.IDCLIENTE;
        const DOCUMENTO = req.body.DOCUMENTO;
        const NOMBRECOMPLETO = req.body.NOMBRE1;
        const IDEQUIPO = req.body.IDEQUIPO;
        const EQUIPO = req.body.EQUIPO;
        const SERIAL = req.body.SERIAL;
        const IDDOCUMENTOGARANTIA = req.body.IDDOCUMENTOGARANTIA;
        const DOCUMENTOGARANTIA = req.body.DOCUMENTOGARANTIA;
        const IDOBSERVACIONENTREGA = req.body.IDOBSERVACIONENTREGA;
        const OBSERVACIONENTREGA = req.body.OBSERVACIONENTREGA;
        const OBSERVACIONESDEENTREGA = req.body.OBSERVACIONESDEENTREGA;
        const USUARIOMODIFICA = result.recordset[0].NOMBRECOMPLETO;  
        
        console.log(id);
         console.log(IDCLIENTE);
         console.log(DOCUMENTO);
         console.log(NOMBRECOMPLETO);
         console.log(IDEQUIPO);
         console.log(EQUIPO);
         console.log(SERIAL);
         console.log(IDDOCUMENTOGARANTIA);
         console.log(DOCUMENTOGARANTIA);
         console.log(IDOBSERVACIONENTREGA);
         console.log(OBSERVACIONENTREGA);
         console.log(OBSERVACIONESDEENTREGA);
         console.log(USUARIOMODIFICA);
        
        const pool = await getConnection();        
        await pool.request()
        .input("IDCLIENTE",sql.Numeric,IDCLIENTE)
        .input("DOCUMENTO",sql.VarChar,DOCUMENTO)
        .input("NOMBRECOMPLETO",sql.VarChar,NOMBRECOMPLETO)
        .input("IDEQUIPO",sql.Numeric,IDEQUIPO)
        .input("EQUIPO",sql.VarChar,EQUIPO)            
        .input("SERIAL",sql.VarChar,SERIAL)
        .input("IDDOCUMENTOGARANTIA",sql.Numeric,IDDOCUMENTOGARANTIA)
        .input("DOCUMENTOGARANTIA",sql.VarChar,DOCUMENTOGARANTIA)              
        .input("IDOBSERVACIONENTREGA",sql.Numeric,IDOBSERVACIONENTREGA)            
        .input("OBSERVACIONENTREGA",sql.VarChar,OBSERVACIONENTREGA)            
        .input("OBSERVACIONESDENETREGA",sql.VarChar,OBSERVACIONESDEENTREGA)        
        .input("USUARIOMODIFICA",sql.VarChar,USUARIOMODIFICA)                                
        .input("ID",sql.Numeric,id)
        .query(queries.actualizarPrestamo);


             
        

        

        if (IDEQUIPO != IDEQUIPOANTES) 
        {
            await pool.request()
            .input("PRESTADO",sql.VarChar,'SI')
            .input("IDLISTADOEQUIPO",sql.Numeric,IDEQUIPO)
            .query(queries.actualizarEquipo);


            await pool.request()
            .input("PRESTADO",sql.VarChar,'NO')
            .input("IDLISTADOEQUIPO",sql.Numeric,IDEQUIPOANTES)
            .query(queries.actualizarEquipo);
        }        
        
        res.redirect(paginaWeb+'/inicio');
              
                         
                 
    }
    catch (error)
    {
        res.status(500)
        res.send(error.message)
    }    
}

export const actualizarDevolucion = async (req,res) => {
    try
    {
        const id = req.body.IDPRESTAMOEQUIPOS;
        const IDOBSERVACIONRECIBIDO = req.body.IDOBSERVACIONRECIBIDO;
        const OBSERVACIONRECIBIDO = req.body.OBSERVACIONRECIBIDO;
        const OBSERVACIONESDERECIBIDO = req.body.OBSERVACIONESDERECIBIDO;
        const USUARIORECIBE = result.recordset[0].NOMBRECOMPLETO;  
        
        const pool = await getConnection();        
        await pool.request()
        .input("IDOBSERVACIONRECIBIDO",sql.Numeric,IDOBSERVACIONRECIBIDO)            
        .input("OBSERVACIONRECIBIDO",sql.VarChar,OBSERVACIONRECIBIDO)            
        .input("OBSERVACIONESDERECIBIDO",sql.VarChar,OBSERVACIONESDERECIBIDO)        
        .input("USUARIORECIBE",sql.VarChar,USUARIORECIBE)                                
        .input("DEVUELTO",sql.VarChar,'SI')                                
        .input("PRESTADO",sql.VarChar,'NO') 
        .input("ID",sql.Numeric,id)
        .query(queries.actualizarDevolucion);
    
        
        res.redirect(paginaWeb+'/inicio');
              
                         
                 
    }
    catch (error)
    {
        res.status(500)
        res.send(error.message)
    }    
}