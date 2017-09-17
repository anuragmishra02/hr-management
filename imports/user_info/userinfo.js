import { Template } from 'meteor/templating';
import "./userinfo.html";
import ipfs from 'ipfs-js';
import Web3 from 'web3';
import {
  hrms_contract,
  contract_abi
} from '../api/hrms.js';
//var Web3 = require('web3');

var id = 1;
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));


//  console.log("web3 >> "+web3.toString());
// // console.log("web3 eth >> "+new Web3().b32tohex("abc"));
//  console.log("web3 eth 22 >> "+web3.utils.toHex("abc"));

// var Web3WsProvider = require('web3-providers-ws');
// var Web3RequestManager = require('web3-core-requestmanager');

// var web3 = new Web3RequestManager(new Web3WsProvider('ws://localhost:8545'));

ipfs.setProvider({
	host: 'localhost',
	port: '5001'
});



var contracthrms;
//var contract_address_direct = "0x64ed4437097c7c5d7e9f7ef9d567c467ba7c5b2f";
//var contract_abi_direct = [{ "constant": true, "inputs": [{ "name": "uid", "type": "string" }], "name": "getCandidateDet", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "uid", "type": "string" }, { "name": "user_det", "type": "string" }], "name": "setCandidateDet", "outputs": [], "payable": false, "type": "function" }];

Template.userinfo.onRendered(function () {
	$('#datepicker').datepicker({
		format: "yyyy/mm/dd",
		autoclose: true,
		todayHighlight: true
	});

	$('#upload-loc').change(function () {
		var filenames = '';
		var filelenght = '';
		for (var i = 0; i < this.files.length; i++) {
			filenames += '<li>' + this.files[i].name + '<span></span></li>';
			filelenght = this.files.length
		}
		$(".upload-filename").show();
		$(".upload-filename").html('<ul>' + filenames + '</ul>');
	});

	$(document).on('click', '.upload-filename ul li span', function () {
		$(this).parents('.upload-filename').hide();
	});

	$('.uplogingitem').change(function () {
		var filenames = '';
		var filelenght = '';
		for (var i = 0; i < this.files.length; i++) {
			filenames += this.files[i].name;
			filelenght = this.files.length
		}
		$(this).next().next(".upload-file-path").html(filenames);
		$(this).parents('.input-type-upload').addClass('active');
	});

	$('.profile-name-txt').click(function () {
		var statusdp = $(this).next('ul.dropdown-menu.animated').css('display');
		if (statusdp == "none") {
			$(this).next('ul.dropdown-menu.animated').show();
		}
		else {
			$('.dropdown-menu.animated').hide();
			$(this).next('ul.dropdown-menu.animated').hide();
		}
	});
	$('.selectSearch').click(function () {
		overlayBox('searchBoxID');
	});

	$('#userDet').html('');

});

Template.userinfo.events({
	'click #submitUserInfo': function () {

		console.log("submit");
		var fname = $("#fname").val();
		var lname = $("#lname").val();
		var datepicker = $("#datepicker").val();
		var panNumber = $("#panNumber").val();

		var rfile = $("#rfile").val();
		var sscfile = $("#sscfile").val();
		var degreefile = $("#degreefile").val();
		var group1 = $("#group1").val();

		var rfileDoc = "#rfile";
		var sscfileDoc = "#sscfile";
		var degreefileDoc = "#degreefile";
		var degreefilehash = "";
		var sscfilehash = "";
		var rfilehash = "";

		ipfs.api.id(function (err, res) {
			if (typeof res !== undefined) {

				// rfile 
				if (rfile !== undefined) {
					console.log("r1");
					getBase64(rfileDoc, function (data1) {
						console.log("r2");
						ipfs.add(data1, function (err, rfilehash1) {
							rfilehash = rfilehash1;
							console.log("r3 >> " + rfilehash);

							// ssc file
							if (sscfile !== undefined) {
								getBase64(sscfileDoc, function (data2) {
									ipfs.add(data2, function (err, sscfilehash1) {
										sscfilehash = sscfilehash1;

										// degree file
										if (degreefile !== undefined) {
											getBase64(degreefileDoc, function (data3) {
												ipfs.add(data3, function (err, degreefilehash1) {
													degreefilehash = degreefilehash1;

													var userDetails = [];
													var jsonData = {};
													jsonData["fname"] = fname;
													jsonData["lname"] = lname;
													jsonData["datepicker"] = datepicker;
													jsonData["rfilehash"] = rfilehash;
													jsonData["sscfilehash"] = sscfilehash;
													jsonData["degreefilehash"] = degreefilehash;
													jsonData["lastupdatedDate"] = new Date();

													userDetails.push(jsonData);

													contracthrms = setcontract(hrms_contract);
													console.log("panNumber >> " + panNumber);

													var getCandidateDet = contracthrms.getCandidateDet(panNumber);

													//	console.log(" >> "+contracthrms.getCandidateUpdatecnt(panNumber));

													// var byteVal = web3.toHex((JSON.stringify(userDetails)));

													var candidateDet;
													if (getCandidateDet != "") {
														candidateDet = getCandidateDet + "||" + JSON.stringify(userDetails);
														console.log("getCandidateDet 11>> " + candidateDet);
													} else {
														candidateDet = JSON.stringify(userDetails);
														console.log("getCandidateDet 22>> " + candidateDet);
													}
													web3.eth.defaultAccount = web3.eth.accounts[0];
													web3.personal.unlockAccount(web3.eth.accounts[0], 'Newuser123')
													//	var setcandidateDetails = contracthrms.setCandidateDet(panNumber, byteVal, { gas: 470000 });

													var setcandidateDetails = contracthrms.setCandidateDet(panNumber, candidateDet, { gas: 470000 });

													//	var custAccountInitilize = contractTI.setCusotmerAccountDetails(accountAddr, 2, 'xyz', 2, '$');

													var checksetcandidateDetails = setInterval(function () {
														var blockNum2 = web3.eth.getTransaction(setcandidateDetails).blockNumber;
														if (blockNum2 == null || blockNum2 == undefined) {
															console.log("still processing..!!")
														} else {
															console.log("block number >> " + blockNum2);


															clearInterval(checksetcandidateDetails);
														}
													}, 5000);
												});
											});
										} else {
											//	localStorage.removeItem("degreefilehash");
										}

									});
								});
							} else {
								//	localStorage.removeItem("sscfilehash");
							}

						});
					});
				} else {
					//	localStorage.removeItem("rfilehash");
				}


			}
		});

	},

	'click #search': function () {

		$('#userDet').html('');
		var pan = $("#pan").val();
		console.log("pan >> " + pan);
		contracthrms = setcontract(hrms_contract);
		var candidateDet = contracthrms.getCandidateDet(pan);
		console.log('getCandidateDet >> ' + candidateDet);

		var str = candidateDet.split("||");
		var strsize = str.length;
		console.log(" len >> " + strsize);

		var tableData = '<table>';

		for (var i = 0; i < strsize; i++) {

			

			console.log(i + " >> " + JSON.parse(str[i]));

			var jsonObj = JSON.parse(str[i]);

			jsonObj.forEach(function (explrObject) {

				tableData += '<tr><td style="padding:5px;">' + explrObject.fname + '</td><td></td><td  style="padding:5px;">' + explrObject.lname + '</td><td></td>'

				tableData += '<td><a id="resume" href="Resume" target="_blank">Resume</a></td></tr>'

				var resumehash = "";
				var sschash = "";
				var degreehash = "";

				if (explrObject.rfilehash !== undefined) {
					getIPFSData(explrObject.rfilehash, function (resumebyte) {
						if (typeof resumebyte !== undefined) {
							$('#resume').attr('href', resumebyte);
					//	resumehash = resumebyte;
					//	console.log(" resumehash >> "+ resumebyte);
						}
					});
				} else {
				//	$('#resume').hide();
				}

				if (explrObject.sscfilehash !== undefined) {
					getIPFSData(explrObject.sscfilehash, function (sscbyte) {
						if (typeof sscbyte !== undefined) {
						//	$('#resume').attr('href', sscbyte);
						}
					});
				} else {
				//	$('#resume').hide();
				}

				if (explrObject.degreefilehash !== undefined) {
					getIPFSData(explrObject.degreefilehash, function (degreebyte) {
						if (typeof degreebyte !== undefined) {
							//$('#resume').attr('href', degreebyte);
						}
					});
				} else {
				//	$('#resume').hide();
				}


				
			});



		}
		tableData += '</table>';

		$('#userDet').append(tableData);

		var ff = "Qmcr5BNx1WQtutVhc5YDcWhiqNnBuXdE3r1HyubFZPdRW6";

		if (ff !== undefined) {
			getIPFSData(ff, function (data) {
				if (typeof data !== undefined) {
					$('#resume').attr('href', data);
				}
			});
		} else {
			$('#resume').hide();
		}

	}
});


function getBase64(selector, callback) {
	var file = $(selector)[0].files[0];
	var reader = new FileReader();
	reader.onload = function (readerEvt) {
		callback(reader.result);
	};
	reader.readAsDataURL(file);
}


var setcontract = function (contract_address) {
	var contract_instance = web3.eth.contract(contract_abi).at(contract_address);
	return contract_instance;
}

var host_ipfs = 'http://127.0.0.1:8080/ipfs/';

function getIPFSData(hash, callback) {
	//	console.log(host_ipfs + hash);
	$.get(host_ipfs + hash, function (data) {
		callback(data);
	}).fail(function (err) {
		console.log(err);
	});
}

// var setcontract = function (contract_address) {
//   var contract_instance = new web3.eth.Contract(contract_abi_direct,contract_address);
//   return contract_instance;
// }

/*Overlay function*/
var animationIn, target, animationOut;
function overlayBox(popupID) {
	target = $('#' + popupID)
	animationIn = target.attr('data-animation-in');
	animationOut = target.attr('data-animation-out');
	if (typeof (animationIn) == 'undefined' || animationIn === '(an empty string)' || animationIn === null || animationIn === '') {
		animationIn = 'zoomIn';
	}
	if (typeof (animationOut) == 'undefined' || animationOut === '(an empty string)' || animationOut === null || animationOut === '') {
		animationOut = 'zoomOut';
	}
	$('body').append('<div class="overlay-bg"></div>')
	target.find('.overlay-header').append('<div class="closeBtn">X</div>');
	target.css('visibility', 'visible').css('display', 'block').find('.overlay-box').addClass('animated').addClass(animationIn);
	$(document).on('click', '.closeBtn, .close-after-sub', function () {
		$('.login-box').removeClass('fadeOutUp').addClass('fadeInup');
		$('.overlay').find('.overlay-box').removeClass('animated').removeClass(animationIn).addClass('animated ' + animationOut);
		$('body .overlay-bg').fadeOut(1000, function () {
			$(this).remove();
			$('.overlay').css('visibility', 'hidden').css('display', 'none').find('.overlay-box').removeClass('animated').removeClass(animationIn).removeClass(animationOut);
		});
		$('.login-box').fadeIn(); $('.login-box').removeClass('rollOut');
	});
}

/*Overlay function end*/