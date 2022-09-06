import React, { useState, useEffect } from "react";
import Input from "../elements/input";
import Button from "../elements/button";
import Messager from "../elements/mensages";

function AddCarPage(){

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

    const timeNow = new Date().toLocaleTimeString('pt-BR', { hour12: false, 
        hour: "numeric", 
        minute: "numeric"});

    /* DADOS CAPTADOS */
    const [placa,setPlaca] = useState("");
    const [data,setData] = useState(currentDate);
    const [hora,setHora] = useState(timeNow);
    const [veiculo,setVeiculo] = useState("");

    const veiculosEstacionados = {
        data: data, // entrada
        hora: hora, // entrada
        veiculo: veiculo,
        placa: placa,
        saida: false,
        horasaida: false,
        valor: "0",
        noPatio: true
    }

    /* MENSAGENS E CONSTANTES DE INTERAçÃO */
    const [eventMensage, setEventMensage] = useState("");
    const [classMsg, setClassMsg] = useState("success");

    function AddData(e){
        e.preventDefault();

        let horaAtual = document.getElementById("hora").value;
        setHora(horaAtual)
        
        fetch("http://localhost:5000/veiculosEstacionados", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(veiculosEstacionados),
        }).then( (resp) => resp.json() )
        .then( function(response) {
            
            const messagerHide = document.getElementById("msg01");
            setClassMsg("success")
            messagerHide.classList.add("visible")

            setEventMensage("Dados inseridos com sucesso.");
            const timeNow = new Date().toLocaleTimeString('pt-BR', { hour12: false, 
                hour: "numeric", 
                minute: "numeric"});
            
            setTimeout(() => {
                document.getElementById("placa").value = "";
                document.getElementById("veiculo").value = "";
                document.getElementById("hora").value = timeNow;

                
                setPlaca(" ");
                setHora(timeNow);
                setVeiculo(" ");
                
            }, "2000")

            setTimeout(() => {
                messagerHide.classList.remove("visible");
            }, "2000")
            
        }).catch( (err) => console.log(err) )
    }

    useEffect(() => {
        document.getElementById("hora").value = timeNow;
        document.getElementById("data").value = currentDate
    }, []);
       
    return(
        <>
            <div className="box boxForm"> 
                <h1>Registrar entrada</h1>
                <form method="post" onSubmit={ AddData } >
                    <Input id="placa" label="Placa" type="text" name="placa_carro" onChangeHandler={e => setPlaca(e.target.value)} value={placa}  />
                    <Input id="data" label="Data" type="date" value={currentDate} name="data_entrada" onChangeHandler={e => setData( e.target.value)} />
                    <Input id="hora" label="Hora" type="time" name="hora_entrada" onChangeHandler={e => setHora(e.target.value)}  />
                    <Input id="veiculo" label="Veículo" type="text" name="veiculo" onChangeHandler={e => setVeiculo(e.target.value)}/>
                    <Button label="Registrar entrada" />
                </form>
            </div>
            <Messager id="msg01" msgClass={classMsg} msg={eventMensage} />
        </>
    )
}

export default AddCarPage;