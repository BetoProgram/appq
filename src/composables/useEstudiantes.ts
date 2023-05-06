import { onMounted, ref } from "vue";
import axios from 'axios';
import { api } from "src/boot/axios";
import { IEstudiantesResponse } from "../models";
import { EstudianteRequest } from "src/models/EstudianteRequest";
import { useLoading } from "./useLoading";

const estudiantes = ref<IEstudiantesResponse[]>([]);
const hasError = ref<boolean>(false);
const isLoading = ref<boolean>(true);
const errorMessage = ref<string>();

export const useEstudiantes = () => {

    const { showLoading } = useLoading();

    onMounted(async() => {
        await obtenerEstudiantes();
    });

    const obtenerEstudiantes = async() => {

        try{
            const { data } = await api.get<IEstudiantesResponse[]>('/estudiantes');
            estudiantes.value = data;
            isLoading.value = false;
        }catch(error){
            setError(error);
        }
        
    }

    const guardarEstudiante = async(estudiante:EstudianteRequest) => {
        try{
            showLoading();
            await api.post('/estudiantes', estudiante);
            await obtenerEstudiantes();
        }catch(error){
            setError(error);
        }
    }

    const editarEstudiante = async(id:number, estudiante:EstudianteRequest) => {
        try{
            showLoading();
            await api.put(`/estudiantes/${1000}`, estudiante);
            await obtenerEstudiantes();
        }catch(error){
            setError(error);
        }
    }

    const eliminarEstudiante = async(id:number) => {
        try{
            showLoading();
            await api.delete(`/estudiantes/${id}`);
            await obtenerEstudiantes();
        }catch(error){
            setError(error);
        }
    }

    const setError = (error:any) => {
        hasError.value = true;
        isLoading.value = false;

        if(axios.isAxiosError(error)){
            console.log(error)
            const mensaje = error.response?.data.errores.mensaje;
            return errorMessage.value = mensaje;
        }
        errorMessage.value = JSON.stringify(error);
    }
    
    return { 
        estudiantes, 
        isLoading, 
        hasError, 
        errorMessage,
        //Metodos
        guardarEstudiante,
        editarEstudiante,
        eliminarEstudiante
    }
}