var rutaWS = "https://www.meridian.com.pe/AntaresAduanas/Servicio/AntaresAduanas/";
//var rutaWS = "https://www.meridian.com.pe/AntaresAduanas/Servicio_TEST/AntaresAduanas/";

var code_usuario = "";
var Li = null;
$(document).ready(function(e) {  
	//getProgramaciones();
	code_usuario = $.QueryString["user"];
	//code_usuario = window.localStorage.getItem("code");
	$("#actualizar").click(function(e) {
        getOrdenes();
    });
	 $("form").keypress(function(e) {
        if (e.which == 13) {
            return false;
        }
    });
	
	$("#guardar").click(function(e) {
		setValidar();
    });
	
	$("#btnContinuar").click(function(e) {
        setGuardar();
    });
	
	$("#btnCancelar").click(function(e) {
       $(".page2").fadeOut(100,function(){
		   $(".page1").fadeIn();
	   });
    });
	
	 
	
 	getOrdenes();
	
	
	//$("#irTracking").attr("href","index.html");
	 
	
});	


function getOrdenes(){
	
	$.mobile.loading('show');
 
	$("#listProgramacion").html("");  
	
	$.ajax({
        url :  rutaWS + "Movil/WS_AuxDespacho.asmx/CargararAuxiliar",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"usuario":"' + code_usuario + '"}',
        //contentType: "xml",
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
		resultado = $.parseJSON(data.d);
			console.log(resultado);
			$.mobile.loading('hide');
			$(".panelMensaje").hide();
			$(".panelOrden").fadeIn("fast");
			
			if ( resultado.length > 0 ){
				var count = 0;
				for (var i = 0; i<resultado.length;i++){  
					
					
					//$("#listProgramacion").append("<li style='position: relative;padding: 0px;' data-orden='"+ $.trim(resultado[i].orden)+"' data-al='"+ $.trim(resultado[i].al)+"' data-nexp='"+ $.trim(resultado[i].nexp)+"' data-sol='"+ $.trim(resultado[i].sol)+"' data-clie='"+ $.trim(resultado[i].cliente)+"' data-serv='"+ $.trim(resultado[i].servicio)+"'><input type='checkbox' id='check" + i + "' /><label for='check" + i + "'>"+ $.trim(resultado[i].orden) + " - <span>" + resultado[i].servicio + "</span><br>" + resultado[i].cliente	+ "<br>" + resultado[i].fecha + " " + resultado[i].hora + "<br><span>" + resultado[i].cont +"</span></label></li>"); 
					
					$("#listProgramacion").append("<li style='position: relative;padding: 0px;' data-previo='"+ $.trim(resultado[i].sprevio)+"' data-orden='"+ $.trim(resultado[i].orden)+"' data-al='"+ $.trim(resultado[i].al)+"' data-nexp='"+ $.trim(resultado[i].nexp)+"' data-sol='"+ $.trim(resultado[i].sol)+"' data-clie='"+ $.trim(resultado[i].cliente)+"' data-serv='"+ $.trim(resultado[i].servicio)+"'><input type='checkbox' id='check" + i + "' /><label for='check" + i + "'><span style='display:block;'>"+ $.trim(resultado[i].orden) + " - " + resultado[i].servicio + "</span><span style='display:block;'>" + resultado[i].cliente	+ "</span><span style='display:block;'>" + resultado[i].fecha + " " + resultado[i].hora + "</span><span style='display:block;'>" + resultado[i].cont +"</span><span style='display:block;'>" + (resultado[i].DIR1 != "" ? resultado[i].DIR1 : "") + (resultado[i].DIR2 != "" ? resultado[i].DIR2 : "") + (resultado[i].DIR3 != "" ?  resultado[i].DIR3 : "") + "</span></label></li>");
				}
				
				$("#listProgramacion").listview("refresh");
				$("#listProgramacion").find("input").each(function(index, element) {
                    $(this).checkboxradio().trigger('create');
                }); 				
			 
			}
			else{
				$(".panelOrden").hide();
				$(".panelMensaje").fadeIn("fast");
			}
        },

        error : function(jqxhr) 
        {
		   //console.log(jqxhr);	
           alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		 
	
}

function setValidar(){
	$("#notificado").val(0);
	$('select#notificado').selectmenu('refresh');
	$(".page2 input[type='text']").val("");
	$(".page2 textarea").val("");
	var FlagCheck = false;
	var FlagSenasa = false;
	$(".DivFecha, .DivObsNoti, .DivNoti").hide();
	
	$("#listProgramacion").find("input").each(function(index, element) {
		if ( $(this).is(":checked") ){
			FlagCheck = true;
			if ($(this).parent().parent().data("serv") == "SENASA"){
				FlagSenasa = true;
			}
		}
	});
	
	if (!FlagCheck){
		alerta("Seleccionar una o más ordenes"); 
		return;
	}	
	
		
	if (FlagSenasa){
		$(".DivFecha, .DivNoti").show();
	}
	
	//$("#myPopup").popup("open");
	$(".page1").fadeOut(100,function(){
		 $(".page2").fadeIn();
	 });
}

function setValidarNotificado(a){
	$(".DivFecha, .DivObsNoti").hide();
	if (a==0){
		$(".DivFecha").show();
	}
	else{
		$(".DivObsNoti").show();
	}
}
function setGuardar(){
	var FlagCheck = false;
	
	
	
	$("#listProgramacion").find("input").each(function(index, element) {
		if ( $(this).is(":checked") ){
			FlagCheck = true;			
		}
	});
	
	if (!FlagCheck){
		alerta("Seleccionar una o más ordenes"); 
		return;
	}
	
	if ($(".DivFecha").css("display") == "block"){
		if ($("#fecha").val() == ""){
			alerta("Ingresar fecha"); 
			$("#fecha").focus()
			return;
		}
	}
	
	if ($(".DivObsNoti").css("display") == "block"){
		if ($("#observacion2").val() == ""){
			alerta("Ingresar motivo"); 
			$("#observacion2").focus()
			return;
		}
	}


	$("#listProgramacion").find("input").each(function(index, element) {
		if ( $(this).is(":checked") ){
			Li = $(this).parent().parent();
			var parametros = new Object();
			parametros.usu = code_usuario;	
			parametros.orden = $(Li).data("orden");	
			parametros.culmi = 1;//$("#concluido").val();	
			parametros.obs = $("#observacion").val();	
			parametros.servicio = $(Li).data("serv");
			parametros.cheque = $("#cheque").val();
			parametros.nroexp = $(Li).data("nexp");
			parametros.clien = $(Li).data("clie");
			parametros.nrosol = $(Li).data("sol");	
			parametros.contenedor = $(Li).find("span").eq(3).text();
			parametros.AL = $(Li).data("al");	
			parametros.chknotifi = $("#notificado").val();	
			parametros.obsnota = $("#observacion2").val();
			parametros.Sprevio = $(Li).data("previo");
			
			if  ( $(Li).data("serv") == "SENASA" ){				
				var strFecha = $("#fecha").val();	
				if (strFecha!= ""){ 
					  parametros.fecha = strFecha;
				}
				else
					parametros.fecha = "01/01/1900";				 	
			}
			else
				parametros.fecha = "01/01/1900";	
			
			
			console.log(parametros);
			$.mobile.loading('show'); 
			$.ajax({
			url :  rutaWS + "Movil/WS_AuxDespacho.asmx/Grabar2",
			type: "POST",
			//crossDomain: true,
			dataType : "json",
			data : JSON.stringify(parametros),
			contentType: "application/json; charset=utf-8",
			success : function(data, textStatus, jqXHR) {
				//console
				console.log(data.d);
				resultado = $.parseJSON(data.d);
				console.log(resultado);
				$.mobile.loading('hide');
				 if ( resultado.code == 1){
					$("#observacion").val("");
					$("#cheque").val("");
					$("#fecha").val("");	
					$(Li).remove();	
					 
					$(".page2").fadeOut(100,function(){
					   $(".page1").fadeIn();
				   });
					 
					getOrdenes();				
				 }			  
				 alerta(resultado.message);
					 
				},
		
				error : function(jqxhr) 
				{ 
					console.log(jqxhr);
				  alerta('Error de conexi\u00f3n, contactese con sistemas!');
				}
		
			});
			$("#myPopup").popup("close");			
		}			 
	});
 
	
	/*var parametros = new Object();
	parametros.usu = code_usuario;	
	parametros.orden = $("#ordenes").val();	
	parametros.culmi = 1;//$("#concluido").val();	
	parametros.obs = $("#observacion").val();	
	parametros.servicio = $("#ordenes option:selected").text();
	parametros.cheque = $("#cheque").val();
	//console.log(parametros);
	//return;
	$.mobile.loading('show'); 
	$.ajax({
        url : "http://www.meridian.com.pe/ServiciosMovil/AntaresAduanas/Movil/WS_AuxDespacho.asmx/Grabar",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : JSON.stringify(parametros),
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
			//console
			resultado = $.parseJSON(data.d);
			$.mobile.loading('hide');
			 if ( resultado.code == 1){
				$("#observacion").val("")
				$("#cheque").val("")
				$("#concluido").val();	
				$("#ordenes").val(0);
				$("#ordenes").selectmenu('refresh', true);
				$("#concluido").selectmenu('refresh', true);
				getProgramaciones();
			 }			  
			 alerta(resultado.message);
			 
        },

        error : function(jqxhr) 
        { 
          alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });	*/	
		
	
}


function alertDismissed(){
}
//

function getProgramaciones(){
	
	$.mobile.loading('show');
 	$("#ordenes").html("<option value='0'>Seleccionar</option>");
	 
	$.ajax({
        url :  rutaWS + "Movil/WS_AuxDespacho.asmx/CargararAuxiliar",
        type: "POST",
		//crossDomain: true,
        dataType : "json",
        data : '{"usuario":"' + code_usuario + '"}',
        //contentType: "xml",
		contentType: "application/json; charset=utf-8",
        success : function(data, textStatus, jqXHR) {
		resultado = $.parseJSON(data.d);
		
			//console.log(resultado);
			$.mobile.loading('hide');
			if ( resultado.length > 0 ){				
				for (var i = 0; i<resultado.length;i++){
					//var nroOrden = resultado[i].nombre;		
					//nroOrden = nroOrden.toString().substring(0,11);		
					$("#ordenes").append("<option value='"+ $.trim(resultado[i].orden)+"'>"+ $.trim(resultado[i].nombre)+"</option>");					
				}
				$("#ordenes").selectmenu('refresh', true);
			}
			else{
				 alerta('No se encontrarón ordenes');
			}
        },

        error : function(jqxhr) 
        {
		   //console.log(jqxhr);	
           alerta('Error de conexi\u00f3n, contactese con sistemas!');
        }

    });		 
	
}


function alerta(mensaje){
	if ( navigator.notification == null ){
		alert(mensaje);
		return;
	}
	 navigator.notification.alert(
            mensaje,  // message
            alertDismissed,         // callback
           'Informaci\u00f3n',            // title
            'Aceptar'                  // buttonName
        	);
	
}
