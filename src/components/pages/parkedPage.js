import React, { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link} from "react-router-dom";

function ParkedPage(){
    const [veiculosEstacionados, setVeiculosEstacionados] = useState([])
    const [precoPark, setPrecoPark] = useState(0)    
    getPrice();

    //obtem o preco dos settings
    function getPrice(){
        fetch("http://localhost:5000/settings", {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }).then( (resp) => resp.json() )
        .then( function(response) {
            setPrecoPark(response[0].preco)
        }).catch( (err) => console.log(err) )
    }


    // funcao que tras os carros estacionados
    function parkedCars(){
        fetch("http://localhost:5000/veiculosEstacionados", {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            }).then( (resp) => resp.json() )
            .then( function(response) {
                setVeiculosEstacionados(response);
            }).catch( (err) => console.log(err) )
    }   
    useEffect(() => {
        parkedCars();
    }, []);

    // função de diferenciação de tempo
    function diff(start, end) {
        start = start.split(":");
        end = end.split(":");
        var startDate = new Date(0, 0, 0, start[0], start[1], 0);
        var endDate = new Date(0, 0, 0, end[0], end[1], 0);
        var diff = endDate.getTime() - startDate.getTime();
        var hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        var minutes = Math.floor(diff / 1000 / 60);
        if (hours < 0)
           hours = hours + 24;
        return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
    }

    // calculo o valor do carro estacionado
    function calculoValor(data, hora, precoPark, id){
            /* DETERMINA DATA E HORA E AUTO PREENCHE OS CAMPOS */
            const date = new Date();
            let day = date.getDate();
            if(day < 10){
                day = "0"+day;
            }
            let month = date.getMonth() + 1;
            if(month < 10){
                month = "0"+month;
            }
            const year = date.getFullYear();
            const currentDate = `${year}-${month}-${day}`;
            // define a hora
            const timeNow = new Date().toLocaleTimeString('pt-BR', { hour12: false, 
                hour: "numeric", 
                minute: "numeric"});
                
            // calcula a diferenca de tempo
            const diference = diff(hora, timeNow) 
            setTimeout(function(){

                document.getElementById("durat"+id).innerHTML = diference;
            }, 300)
            const diferenceParts = diference.split(":");


            // quebra a hora 00:01 em duas partes 00 e 01, tira o percentual da hora em minutos e adiciona as horas em 60
            const horasAdicionais = diferenceParts[0] * 1;
            const horaPercentual = (diferenceParts[1] / 60) + horasAdicionais;

            
            const precoFinal = horaPercentual * precoPark;
            
            return "R$ " + precoFinal.toFixed(2);



        
    }

    setTimeout(function(){
        const lines = document.querySelectorAll(".veiculosLista li").length -1;
        console.log(lines)
        document.getElementById("totalveiculos").innerHTML = lines
    }, 1000)
 
    
    return (

        <div className="box boxForm">
            <h1>Veículos estacionados</h1>
            <div className="capacity">
                <span id="totalveiculos">...</span> veículos estacionados / capacidade: 250 
            </div>
            <div className="veiculosLista">
                <ul>
                    <li>
                        <span className="col1">Entrada</span>
                        <span className="col2">Placa</span>
                        <span className="col3">Veículo</span>
                        <span className="col4">Tempo</span>
                        <span className="col5">Valor</span>
                    </li>
                    
                    {   veiculosEstacionados.map( (option) => (
                        option.noPatio == true ?
                        <li key={option.id}> 
                            <span className="col12">{option.data} <strong>{option.hora}</strong></span>
                            <span className="col21">{option.placa}</span>
                            <span className="col31">{option.veiculo}</span>
                            <span className="col41" id={`durat${option.id}`}></span>
                            <span className="col51">{calculoValor(option.data,option.hora, precoPark, option.id)}</span>
                            <span className="col61"><Link to={`/exit/${option.id}`}>Saída</Link></span>
                        </li>
                        : " "
                    ))}
                                    
                </ul>
            </div>

        </div>
    )
}

export default ParkedPage;