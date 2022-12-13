import {Router} from 'express';
import {ruta} from '../app.js';
import path from 'path';
import {getConnection,sql} from '../database/conexion.js';
import {queries} from '../database/query.js';
import {newAgendamiento,crearAgendamiento,viewClient,newCliente,result,listContenedor,seleccionEquipo,actualizarPrestamo,actualizarDevolucion} from '../controllers/contenedor.controller.js';
const router = Router();
let existe = false;
router.get('/',(req , res)=>{   
    if (result.rowsAffected == 0)
    {
        existe=true;    
    }
    else
    {
        existe=false;    
    }       
    res.render(path.join(ruta+'/view/index.ejs'),({cantidad:existe}));    
});

//router.get('/nuevo/:id',createProveedor);

//router.post('/proveedor',nuevoProveedor);

//router.get('/:id',getProveedor);

router.get('/actualizar/:id',seleccionEquipo);

router.post('/prestamo',viewClient);

router.get('/agendamiento/edit/:id',viewClient);

router.post('/updateAgendamiento',actualizarPrestamo);

router.post('/updateDevolucion',actualizarDevolucion);

router.get('/inicio',listContenedor);

router.get('/prestamos/create',newAgendamiento);

router.post('/crearPrestamo',crearAgendamiento);

router.post('/newCliente',newCliente);
//router.put('/proveedor',);

//router.delete('/proveedor',);

export default router;