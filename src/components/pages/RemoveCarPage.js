import React, { useEffect, useState } from "react";
import Input from "../elements/input";
import Button from "../elements/button";
import Messager from "../elements/mensages";
import { useParams } from "react-router-dom";


function ExitPage(){

    // pega os paramentros da url
    const { id } = useParams();

    // msgs
    const [eventMensage, setEventMensage] = useState("Saída registrada");
    const [classMsg, setClassMsg] = useState("success");

    // objeto do veiculo
    const veiculosEstacionados = {
        data: "", // entrada
        hora: "", // entrada
        veiculo: "",
        placa: "",
        saida: false,
        horasaida: false,
        valor: "",
        noPatio: true
    }


    // obtem os dados do carro
    function getCarData(){
        
        fetch(`http://localhost:5000/veiculosEstacionados/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        }).then( (resp) => resp.json() )
        .then( function(response) {
            setDadosVeiculo(response)
        }).catch( (err) => console.log(err) )
    }

    // estrutura dos dados do veiculo
    function setDadosVeiculo(data){
        // preeche objeto e campos com dados iniciais
        veiculosEstacionados.data = data.data;
        document.getElementById("data"). value = data.data;
        veiculosEstacionados.hora = data.hora;
        document.getElementById("hora"). value = data.hora;
        veiculosEstacionados.placa = data.placa;
        document.getElementById("placa"). value = data.placa;
        veiculosEstacionados.veiculo = data.veiculo;
        document.getElementById("veiculo"). value = data.veiculo;

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

        veiculosEstacionados.saida = currentDate;
        document.getElementById("datasaida").value = currentDate;

        const timeNow = new Date().toLocaleTimeString('pt-BR', { hour12: false, 
            hour: "numeric", 
            minute: "numeric"});
        
        document.getElementById("horasaida").value = currentDate;



        function horaSaidaTimmer(data){
            const timeNow = new Date().toLocaleTimeString('pt-BR', { hour12: false, 
                hour: "numeric", 
                minute: "numeric"}); 

            veiculosEstacionados.horasaida = timeNow;
            document.getElementById("horasaida").value = timeNow;

        // determina diferenca de tempo e valor do preco e cobranca
            const diference = diff(data.hora, timeNow) 
            document.getElementById("parked").value = diference
            getCarData(diference);
            function getCarData(tempo){
                fetch("http://localhost:5000/settings", {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json'
                    }
                }).then( (resp) => resp.json() )
                .then( function(response) {

                    // formata e ajusta o preco
                        let precoInput = document.getElementById("preco");
                        let tempoTratado = tempo.split(":")
                        let tempoCondicional = parseInt(tempoTratado[0]) + parseInt(tempoTratado[1]) / 60;

                        document.getElementById("percentual").value = tempoCondicional.toFixed(2);

                        let preco = tempoCondicional * response[0].preco;
                        
                        precoInput.value = preco.toFixed(2);
                        veiculosEstacionados.valor = preco.toFixed(2);

                }).catch( (err) => console.log(err) )
            }
        }

        // funcao que faz a diferenca de preco
        function diff(start, end) {
            start = start.split(":");
            end = end.split(":");
            var startDate = new Date(0, 0, 0, start[0], start[1], 0);
            var endDate = new Date(0, 0, 0, end[0], end[1], 0);
            var diff = endDate.getTime() - startDate.getTime();
            var hours = Math.floor(diff / 1000 / 60 / 60);
            diff -= hours * 1000 * 60 * 60;
            var minutes = Math.floor(diff / 1000 / 60);
        
            // If using time pickers with 24 hours format, add the below line get exact hours
            if (hours < 0)
               hours = hours + 24;
        
            return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
        }

        // atualiza o tempo
        const timmer = setInterval(horaSaidaTimmer(data), 60000) 

        
    }
    useEffect(() => {
        getCarData(1);
    }, []);

    
    
    

    // registrar saida
    function registroDeSaida(e){
        e.preventDefault();

        veiculosEstacionados.noPatio = false;

        console.log(veiculosEstacionados);
        // conectapara o update
        fetch(`http://localhost:5000/veiculosEstacionados/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(veiculosEstacionados),
        }).then( (resp) => resp.json() )
        .then( function(response) {

            setEventMensage("Saída registrada com sucesso.");
            const messagerHide = document.getElementById("msg01");
            setClassMsg("success");
            messagerHide.classList.add("visible");

            setTimeout(function(){
                let url = "http://localhost:3000/parked";
                window.location.href = url;

            }, 2000)

        }).catch( (err) => console.log(err) )
        

    }



    return(
        <> 
            <div className="box boxForm">
                <h1>Registrar saída</h1>
                <form method="post" onSubmit={ registroDeSaida } >
                    <Input 
                        id="placa" 
                        label="Placa" 
                        type="text" 
                        name="placa_carro" 
                        readOnly="true"
                        value={veiculosEstacionados.placa}
                         />
                        
                    <Input 
                        id="veiculo" 
                        label="Veículo" 
                        type="text" 
                        name="veiculo" 
                        readOnly="true" />

                    <Input 
                        id="data" 
                        label="Data de entrada" 
                        type="date" 
                        name="data_entrada" 
                        readOnly="true"
                        value={veiculosEstacionados.data} />
                    <Input 
                        id="hora" 
                        label="Hora de entrada" 
                        type="time" 
                        name="hora_entrada" 
                        readOnly="true"
                        value={veiculosEstacionados.hora} />

                    <Input 
                        id="datasaida" 
                        label="Data de saída" 
                        type="date" 
                        name="data_saida" />
                    <Input 
                        id="horasaida" 
                        label="Hora de saída" 
                        type="time" 
                        name="hora_saida" />

                    <Input 
                        id="parked" 
                        label="Duração" 
                        type="time" 
                        name="hora_duracao" />

                    <label>Percentual de hora:                    
                        <input 
                            id="percentual" 
                            label="Percentual de hora" 
                            type="number" 
                            min="0.01" max="99.99" step="0.01"
                            name="hora_percentual" />
                    </label>

                    <label>Preço a pagar:                    
                        <input 
                            id="preco" 
                            label="Preço a pagar" 
                            type="number" 
                            min="0.01" max="99.99" step="0.01"
                            name="hora_entrada"
                            readOnly />
                    </label>

                    <label>Método de pagamento
                        <select>
                            <option>Dinheiro</option>
                            <option>Cartão</option>
                            <option>Convênio</option>
                        </select>
                    </label>
                    
                    <Button label="Registrar saída" />
                </form>
            </div>
            <Messager id="msg01" msgClass={classMsg} msg={eventMensage} />
        </>
    )
}

export default ExitPage;