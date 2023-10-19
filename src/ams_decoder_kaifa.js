module.exports = function(RED) {
    function ams_decoder_kaifa(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {


var Obis_list = new Object()

msg.payload = msg.payload.toUpperCase(); // Fjerner risiko for små og store bokstaver i motatt string
index = msg.payload.indexOf("FF800000")+8 // finner index til info om hvor mange objekter meldingen inneholder
elements = hex_to_dec(msg.payload.substr((index+2),2)) // Leser av antall elementer i motatt data

 // Process the elements based on their count
 if (elements === 1) {
    listType = 'list1';
    Obis_list.act_pow_pos = hex_to_dec(msg.payload.substr(index + 6, 8)) / 1000;
  }

  if (elements >= 9) {
    index = index + 6;
    l = hex_to_dec(msg.payload.substr(index, 2)) * 2;
    Obis_list.obis_list_version = hex_to_ascii(msg.payload.substr(index + 2, l));
    index += 4 + l;
    l = hex_to_dec(msg.payload.substr(index, 2)) * 2;
    Obis_list.meter_ID = hex_to_ascii(msg.payload.substr(index + 2, l));
    index += 4 + l;
    l = hex_to_dec(msg.payload.substr(index, 2)) * 2;
    Obis_list.meter_model = hex_to_ascii(msg.payload.substr(index + 2, l));
    index += 4 + l;
    Obis_list.act_pow_pos = hex_to_dec(msg.payload.substr(index, 8)) / 1000;
    Obis_list.act_pow_posProduction = hex_to_dec(msg.payload.substr(index += 10, 8)) / 1000;
    Obis_list.act_pow_posReactive = hex_to_dec(msg.payload.substr(index += 10, 8)) / 1000;
    Obis_list.act_pow_posProductionReactive = hex_to_dec(msg.payload.substr(index += 10, 8)) / 1000;
  }

  if (elements === 9 || elements === 14) {
    listType = 'list2';
    index += 0;
    Obis_list.curr_L1 = hex_to_dec(msg.payload.substr(index += 10, 8)) / 1000;
    Obis_list.volt_L1 = hex_to_dec(msg.payload.substr(index += 10, 8)) / 10;
  }

  if (elements === 13 || elements === 18) {
    listType = 'list2';
    index += 0;
    Obis_list.curr_L1 = hex_to_dec(msg.payload.substr(index += 10, 8)) / 1000;
    Obis_list.curr_L2 = hex_to_dec(msg.payload.substr(index += 10, 8)) / 1000;
    Obis_list.curr_L3 = hex_to_dec(msg.payload.substr(index += 10, 8)) / 1000;
    Obis_list.volt_L1 = hex_to_dec(msg.payload.substr(index += 10, 8)) / 10;
    Obis_list.volt_L2 = hex_to_dec(msg.payload.substr(index += 10, 8)) / 10;
    Obis_list.volt_L3 = hex_to_dec(msg.payload.substr(index += 10, 8)) / 10;

    if (Obis_list.volt_L2 === 0) {
      Obis_list.volt_L2 = (Math.sqrt((Obis_list.volt_L1 - Obis_list.volt_L3 * 0.5) ** 2 + (Obis_list.volt_L3 * 0.866) ** 2)).toFixed(0) * 1;
    }
  }

  // Datetime format: 2023-01-10T18:00:00
  if (elements === 14 || elements === 18) {
    listType = 'list3';
    Obis_list.meterDate = getAmsTime(msg, index += 12);
    index += 14;
    Obis_list.lastMeterConsumption = hex_to_dec(msg.payload.substr(index += 12, 8)) / 1000;
    Obis_list.lastMeterProduction = hex_to_dec(msg.payload.substr(index += 10, 8)) / 1000;
    Obis_list.lastMeterConsumptionReactive = hex_to_dec(msg.payload.substr(index += 10, 8)) / 1000;
    Obis_list.lastMeterProductionReactive = hex_to_dec(msg.payload.substr(index += 10, 8)) / 1000;
    Obis_list.freshHour = Obis_list.meterDate.substr(14, 2) === '00';
    Obis_list.freshDay = Obis_list.meterDate.substr(11, 5) === '00:00';
    Obis_list.isFirstDayOfMonth = (Obis_list.meterDate.substr(8, 2) === '01' && Obis_list.freshDay);
  }
function hex_to_dec(str1)
    {
        var hex = str1
        var dec = parseInt(hex,16)
        return dec;
    }
function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }

msg.payload = Obis_list
if (Object.getOwnPropertyNames(Obis_list).length === 0){
    node.error("Data is not compatible, Check string from AMS-meter", msg)
}
else {
node.send(msg)
}
});
}
RED.nodes.registerType("AMS Decoder Kaifa",ams_decoder_kaifa);
}
