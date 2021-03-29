'use strict'
//const socket = io();

var app = angular.module('app', ['ngRoute', 'ngMaterial', 'ngMessages', 'ui.bootstrap']);

app.config(['$routeProvider', function ($routeProvider, $routeParams) {
	$routeProvider
		.when ('/Certificati', {
			templateUrl: 'views/Certificati.html',
			controller: 'Certificati_Controller'
		})
		.otherwise ({
			redirectTo: '/Certificati'
		})
}]);




app.controller('Certificati_Controller', ['$scope', '$route', '$rootScope', '$routeParams', '$sce', 'cm', 'Global', function ($scope, $route, $rootScope, $routeParams, $sce, cm, Global) {	
	
	$rootScope.current_Sezione = 'Certificati';
	console.log('Certificati_Controller (0)');
	
	
	
	
	// Qua dentro ciò che va eseguito al termine del caricamento della pagina! ;-)
	$scope.$on('$includeContentLoaded', function(event) {
		$('#Modal_CrtTextCode').modal('show');
	});
}]);











app.run(function($rootScope, $routeParams, $route, $sce, cm, Global, naturalService, $http) {
	if ( $rootScope.getGlobal_Returned )
	{
		cm.emit('getGlobal');
		console.log("- emit() getGlobal");
		$rootScope.getGlobal_Returned = false;
	}
	
	cm.on('getGlobal_Return', function (data) {
		$rootScope.getGlobal_Returned = true;
		
		console.log('- on() getGlobal_Return: ');
		//console.log('  ' + data);

		$rootScope.SUITE_NAME = data.SUITE_NAME;
		$rootScope.SUITE_AUTHOR = data.SUITE_AUTHOR;
		$rootScope.SUITE_AUTHOR_URL = data.SUITE_AUTHOR_URL;
	});
	
	
	
	
	
	



	$rootScope.crt_Decode = function() {
	
		$rootScope.crtTextCode_First = false; 
		cm.emit('crt_Decode', $rootScope.Modal_CrtTextCode_Input);
		console.log("- emit() crt_Decode");
	}
	cm.on('crt_Decode_Return', function (data) {
		console.log('- on() crt_Decode_Return');
		console.log(data);
		
		$rootScope.crtTextCode_CN = data.CN;
		$rootScope.crtTextCode_Issuer = data.Issuer;
		$rootScope.crtTextCode_NotBefore = data.NotBefore;
		$rootScope.crtTextCode_NotAfter = data.NotAfter;
		$rootScope.crtTextCode_Is_CA = data.Is_CA;
		
		console.log('crtTextCode_CN: ' + $rootScope.crtTextCode_CN);
		console.log('crtTextCode_Issuer: ' + $rootScope.crtTextCode_Issuer);
		console.log('crtTextCode_NotBefore: ' + $rootScope.crtTextCode_NotBefore);
		console.log('crtTextCode_NotAfter: ' + $rootScope.crtTextCode_NotAfter);
		console.log('crtTextCode_Is_CA: ' + $rootScope.crtTextCode_Is_CA);
		
		$rootScope.crtTextCode_FileName = '';
		
		if ($rootScope.crtTextCode_Is_CA.toUpperCase() == 'TRUE')
		{
			if ($rootScope.crtTextCode_CN == $rootScope.crtTextCode_Issuer)
				$rootScope.crtTextCode_FileName += 'Root__' + $rootScope.crtTextCode_CN ;
			else
				$rootScope.crtTextCode_FileName += 'Intermediate__' + $rootScope.crtTextCode_CN ;
		} else {
			$rootScope.crtTextCode_FileName = $rootScope.crtTextCode_CN ;
		}
		
		$rootScope.crtTextCode_FileName = $rootScope.crtTextCode_FileName
												.replaceAll(" ", "_")
												.replaceAll("*", "asterisc");
		
		const d = new Date($rootScope.crtTextCode_NotAfter);
		$rootScope.crtTextCode_NotAfter_Anno   =   d.getFullYear();
		$rootScope.crtTextCode_NotAfter_Mese   = ( d.getMonth() + 1 ).toString().padStart(2, '0');
		$rootScope.crtTextCode_NotAfter_Giorno =   d.getDate()       .toString().padStart(2, '0');
		$rootScope.crtTextCode_FileName += '__' 
											+ $rootScope.crtTextCode_NotAfter_Anno
											+ $rootScope.crtTextCode_NotAfter_Mese
											+ $rootScope.crtTextCode_NotAfter_Giorno
											;
		
		$rootScope.crtTextCode_FileName += '.crt' ;
		console.log('crtTextCode_FileName: ' + $rootScope.crtTextCode_FileName);
		
		$rootScope.crtTextCode_TOBE  = 'CN:     ' + $rootScope.crtTextCode_CN + '\n';
		$rootScope.crtTextCode_TOBE += 'Issuer: ' + $rootScope.crtTextCode_Issuer + '\n';
		$rootScope.crtTextCode_TOBE += 'From:   ' + $rootScope.crtTextCode_NotBefore + '\n';
		$rootScope.crtTextCode_TOBE += 'To:     ' + $rootScope.crtTextCode_NotAfter + '\n';
		$rootScope.crtTextCode_TOBE += '\n';
		$rootScope.crtTextCode_TOBE += $rootScope.Modal_CrtTextCode_Input + '\n';
		console.log('crtTextCode_TOBE: ');
		console.log($rootScope.crtTextCode_TOBE);
		
	});	
	$rootScope.crt_Decode_Modal = function() {

		$('#Modal_CrtTextCode').modal();
		$('#Modal_CrtTextCode').modal('handleUpdate');
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	$rootScope.natural = function (field) {
        return function (item) {
            return naturalService.naturalValue(item[field]);
        }
    };
	
	$rootScope.copyValue = function(string) {
		// ===================================
		// Salvo il BRANCH nella Clipboard!
		var aux = document.createElement("input");
		aux.setAttribute("value", string.trim());
			console.log('- copyValue:');
			console.log(string.trim());
		document.body.appendChild(aux);
		aux.select();
		document.execCommand("copy");
		document.body.removeChild(aux);
		// ===================================
	}
	$rootScope.copyValueMultiline = function(string) {
		// ===================================
		// Salvo il BRANCH nella Clipboard!
		var aux = document.createElement("textarea");
		//aux.setAttribute("value", string.trim());
		document.body.appendChild(aux);
		aux.innerHTML = string.trim()
			console.log('- copyValueMultiline:');
			console.log(string.trim());
		aux.select();
		document.execCommand("copy");
		document.body.removeChild(aux);
		// ===================================
	}

	$rootScope.cm_Exception_Svuota = function() {
		console.log('- cm_Exception_Svuota');
		$rootScope.eccezioni = []; 
	}
	cm.on('cm_Exception', function (data) {
		
		let tmpF = $rootScope.f_RemoveColorCodes(data.FUNCTION); 
		let tmpM = $rootScope.f_RemoveColorCodes(data.MESSAGE); 
		let tmpS = $rootScope.f_RemoveColorCodes(data.STACK); 
		let tmpC = $rootScope.f_RemoveColorCodes(data.CODE); 
		let tmpE = $rootScope.f_RemoveColorCodes('' + data.ERRNO); // Il ERRNO è sempre un Integer; in questo caso aggiungo un '' per castarlo a String, altrimenti la replace() fallisce! 
		let tmpP = $rootScope.f_RemoveColorCodes(data.PATH); 
		
		console.log('- on() cm_Exception 1');
		console.log('            FUNCTION: ' + tmpF);
		console.log('            MESSAGE: ' + tmpM);
		console.log('            STACK: ' + tmpS);
		console.log('            CODE: ' + tmpC);
		console.log('            ERRNO: ' + tmpE); 
		console.log('            PATH: ' + tmpP);
		
		$rootScope.eccezioni.push({
				FUNCTION: tmpF,
				MESSAGE: tmpM,
				STACK: tmpS,
				CODE: tmpC,
				ERRNO: tmpE,
				PATH: tmpP
			});
		
		$('#ModalException').modal({
			keyboard: false
		});

		console.log(data);
	});	
	
	$rootScope.cm_Error_Svuota = function() {
		console.log('- cm_Error_Svuota');
		$rootScope.errori = []; 
	}
	cm.on('cm_Error', function (data) {

		console.log('- on() cm_Error 1');
		console.log('            FUNCTION: ' + data.FUNCTION);
		console.log('             MESSAGE: ' + data.MESSAGE);
		console.log('             CODE: ' + data.CODE);
		console.log('             ERRNO: ' + data.ERRNO);
		console.log('             PATH: ' + data.PATH);
		
		$rootScope.errori.push({
				FUNCTION: data.FUNCTION,
				MESSAGE: data.MESSAGE,
				CODE: data.CODE,
				ERRNO: data.ERRNO,
				PATH: data.PATH
			});
		
		$('#ModalError').modal({
			keyboard: false
		});
		
		console.log(data);
	});
		
	$rootScope.cm_Avvisi_Svuota = function() {
		console.log('- cm_Avvisi_Svuota');
		$rootScope.avvisi = []; 
	}
	cm.on('cm_Avvisi', function (data) {

		console.log('- on() cm_Avvisi');
		console.log('         FUNCTION: ' + data.FUNCTION);
		console.log('           STATUS: ' + data.STATUS);
		console.log('          MESSAGE: ' + data.MESSAGE);
		
		$rootScope.avvisi.push({
				FUNCTION: data.FUNCTION,
				  STATUS: data.STATUS,
				 MESSAGE: data.MESSAGE
			});
		
		$('#ModalAvvisi').modal({
			keyboard: false
		});
		
		console.log(data);
	});
});





app.factory('cm', ['$rootScope', function ($rootScope) {
	$rootScope.getGlobal_Returned = true;
	$rootScope.Modal_CrtTextCode_Input = '';
	
	$rootScope.crtTextCode_CN = '';
	$rootScope.crtTextCode_Issuer = '';
	$rootScope.crtTextCode_First = true;

	console.log('- Instanzio la Factory \"cm\"');
	
	$rootScope.eccezioni = [];
	$rootScope.errori = [];
	$rootScope.avvisi = [];

	$rootScope.dateToTimestamp = function(inputDateString){
		var tmp = inputDateString || ''
		var giorno = tmp.substring(6, 8);
		var mese = tmp.substring(4, 6);
		var anno = tmp.substring(0, 4);
		return new Date( mese +'/' + giorno + '/' + anno).getTime();
	};
	
	
	$rootScope.f_ReplaceColorCodes = function(inStr){
		let ret = inStr		.replace(/\033\[(0;30)m/g,			'<span class="text-dark">');		// FGNero=			"\033[0;30m"
			ret = ret		.replace(/\033\[(1;30)m/g,			'<span class="text-secondary">');	// FGGrigioScuro=	"\033[1;30m"
			ret = ret		.replace(/\033\[(0;37)m/g,			'<span class="text-muted">');		// FGGrigioChiaro=	"\033[0;37m"
			ret = ret		.replace(/\033\[(0;31)m/g,			'<span class="FGRosso">');			// FGRosso=			"\033[0;31m"
			ret = ret		.replace(/\033\[(1;31)m/g,			'<span class="text-danger">');		// FGRossoChiaro=	"\033[1;31m"
			ret = ret		.replace(/\033\[(0;32)m/g,			'<span class="FGVerde">');			// FGVerde=			"\033[0;32m"
			ret = ret		.replace(/\033\[(1;32)m/g,			'<span class="text-success">');		// FGVerdeChiaro=	"\033[1;32m"
			ret = ret		.replace(/\033\[(0;33)m/g,			'<span class="FGMarrone">');		// FGMarrone=		"\033[0;33m"
			ret = ret		.replace(/\033\[(1;33)m/g,			'<span class="FGGiallo">');			// FGGiallo=		"\033[1;33m"
			ret = ret		.replace(/\033\[(0;34)m/g,			'<span class="FGBlu">');			// FGBlu=			"\033[0;34m"
			ret = ret		.replace(/\033\[(1;34)m/g,			'<span class="FGBluChiaro">');		// FGBluChiaro=		"\033[1;34m"
			ret = ret		.replace(/\033\[(0;36)m/g,			'<span class="FGAzzurro">');		// FGAzzurro=		"\033[0;36m"
			ret = ret		.replace(/\033\[(1;36)m/g,			'<span class="text-primary">');		// FGAzzurroChiaro=	"\033[1;36m"
			ret = ret		.replace(/\033\[(0;35)m/g,			'<span class="FGViola">');			// FGViola=			"\033[0;35m"
			ret = ret		.replace(/\033\[(1;35)m/g,			'<span class="FGFucsia">');			// FGFucsia=		"\033[1;35m"
			ret = ret		.replace(/\033\[(1;37)m/g,			'<span class="text-white">');		// FGBianco=		"\033[1;37m"
			ret = ret		.replace(/\033\[0m/g,				'</span>');							// FGReset=			"\033[0m"
			ret = ret		.replace(/\033\[10000C\033\[50D/g,	'<span class="FGGiallo"> --> ');	// f_OK | f_KO --> Dove si posiziona alla fine della riga! --> "\033[10000C\033[50D"

		return ret;
	};
	
	
	$rootScope.f_RemoveColorCodes = function(inStr){
		let ret = inStr		.replace(/\033\[(0;30)m/g,			'');		// FGNero=			"\033[0;30m"
			ret = ret		.replace(/\033\[(1;30)m/g,			'');		// FGGrigioScuro=	"\033[1;30m"
			ret = ret		.replace(/\033\[(0;37)m/g,			'');		// FGGrigioChiaro=	"\033[0;37m"
			ret = ret		.replace(/\033\[(0;31)m/g,			'');		// FGRosso=			"\033[0;31m"
			ret = ret		.replace(/\033\[(1;31)m/g,			'');		// FGRossoChiaro=	"\033[1;31m"
			ret = ret		.replace(/\033\[(0;32)m/g,			'');		// FGVerde=			"\033[0;32m"
			ret = ret		.replace(/\033\[(1;32)m/g,			'');		// FGVerdeChiaro=	"\033[1;32m"
			ret = ret		.replace(/\033\[(0;33)m/g,			'');		// FGMarrone=		"\033[0;33m"
			ret = ret		.replace(/\033\[(1;33)m/g,			'');		// FGGiallo=		"\033[1;33m"
			ret = ret		.replace(/\033\[(0;34)m/g,			'');		// FGBlu=			"\033[0;34m"
			ret = ret		.replace(/\033\[(1;34)m/g,			'');		// FGBluChiaro=		"\033[1;34m"
			ret = ret		.replace(/\033\[(0;36)m/g,			'');		// FGAzzurro=		"\033[0;36m"
			ret = ret		.replace(/\033\[(1;36)m/g,			'');		// FGAzzurroChiaro=	"\033[1;36m"
			ret = ret		.replace(/\033\[(0;35)m/g,			'');		// FGViola=			"\033[0;35m"
			ret = ret		.replace(/\033\[(1;35)m/g,			'');		// FGFucsia=		"\033[1;35m"
			ret = ret		.replace(/\033\[(1;37)m/g,			'');		// FGBianco=		"\033[1;37m"
			ret = ret		.replace(/\033\[0m/g,				'');		// FGReset=			"\033[0m"
			ret = ret		.replace(/\033\[10000C\033\[50D/g,	' --> ');	// f_OK | f_KO --> Dove si posiziona alla fine della riga! --> "\033[10000C\033[50D"

		return ret;
	};
	
	
	
	
	
	
	
	
	
	var socket = io.connect();
	return	{
		on: function (eventName, callback) 
		{
			socket.on(eventName, function () 
			{
				var args = arguments;
				$rootScope.$apply(function () 
				{
					callback.apply(socket, args);
				});
			});
	    },
	    emit: function (eventName, data, callback)
	    {
	    	socket.emit(eventName, data, function ()
	    	{
	    		var args = arguments;
	    		$rootScope.$apply(function () 
	    		{
	    			if (callback)
	    			{
	    				callback.apply(socket, args);
	    			}
	    		});
	    	})
	    }
	};
}]);






app.factory('Global', function() {
	return {
		  SUITE_NAME : '',
		  SUITE_AUTHOR : '',
		  SUITE_AUTHOR_URL : ''
	};
});






app.factory("naturalService", ["$locale", function($locale) {
	// the cache prevents re-creating the values every time, at the expense of
	// storing the results forever. Not recommended for highly changing data
	// on long-term applications.
	var natCache = {};
// amount of extra zeros to padd for sorting
    var padding = function(value) {
		return '00000000000000000000'.slice(value.length);
	};
	
	// Calculate the default out-of-order date format (d/m/yyyy vs m/d/yyyy)
    var natDateMonthFirst = $locale.DATETIME_FORMATS.shortDate.charAt(0) == 'm';
	// Replaces all suspected dates with a standardized yyyy-m-d, which is fixed below
    var fixDates = function(value) {
		// first look for dd?-dd?-dddd, where "-" can be one of "-", "/", or "."
        return value.replace(/(\d\d?)[-\/\.](\d\d?)[-\/\.](\d{4})/, function($0, $m, $d, $y) {
			// temporary holder for swapping below
            var t = $d;
			// if the month is not first, we'll swap month and day...
            if(!natDateMonthFirst) {
                // ...but only if the day value is under 13.
                if(Number($d) < 13) {
                    $d = $m;
                    $m = t;
                }
            } else if(Number($m) > 12) {
				// Otherwise, we might still swap the values if the month value is currently over 12.
                $d = $m;
                $m = t;
            }
			// return a standardized format.
            return $y+'-'+$m+'-'+$d;
        });
    },
	
	// Fix numbers to be correctly padded
    fixNumbers = function(value) {
 		// First, look for anything in the form of d.d or d.d.d...
        return value.replace(/(\d+)((\.\d+)+)?/g, function ($0, integer, decimal, $3) {
			// If there's more than 2 sets of numbers...
            if (decimal !== $3) {
                // treat as a series of integers, like versioning,
                // rather than a decimal
                return $0.replace(/(\d+)/g, function ($d) {
                    return padding($d) + $d
                });
            } else {
				// add a decimal if necessary to ensure decimal sorting
                decimal = decimal || ".0";
                return padding(integer) + integer + decimal + padding(decimal);
            }
        });
    },

	// Finally, this function puts it all together.
    natValue = function (value) {
        if(natCache[value]) {
            return natCache[value];
        }
        var newValue = fixNumbers(fixDates(value));
        return natCache[value] = newValue;
    };

// The actual object used by this service
return {
	naturalValue: natValue,
	naturalSort: function(a, b) {
		a = natVale(a);
		b = natValue(b);
		return (a < b) ? -1 : ((a > b) ? 1 : 0)
	}
};
}]);







/**
 * Filters out all duplicate items from an array by checking the specified key
 * @param [key] {string} the name of the attribute of each object to compare for uniqueness
 if the key is empty, the entire object will be compared
 if the key === false then no filtering will be performed
 * @return {array}
 */
app.filter('unique', function () {
	return function (items, filterOn) {
		if (filterOn === false) {
			return items;
		}

		if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
			var hashCheck = {}, newItems = [];

			var extractValueToCompare = function (item) {
				if (angular.isObject(item) && angular.isString(filterOn)) {
					return item[filterOn];
				} else {
					return item;
				}
			};

			angular.forEach(items, function (item) {
				var valueToCheck, isDuplicate = false;

				for (var i = 0; i < newItems.length; i++) {
					if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
						isDuplicate = true;
						break;
					}
				}
				if (!isDuplicate) {
					newItems.push(item);
				}
			});
			
			items = newItems;
		}
		
		return items;
	};
});



app.filter('replaceTATAG', [function () {

    return function (input, from, to) {
      
      if(input === undefined) {
        return;
      }
      
      var from2 = '<<' + from + '>>';
      var regex = new RegExp(from2, 'g');
      return input.replace(regex, to);
       
    };


}]);





app.filter('substr', function() {
	return function(input, start) 
	{
		if (input != undefined) 
		{
			return ( input.length >=  length ? input.substring( start ) : input );
		} else{ 
			return "";
		}
	};
});


















app.directive('clickLink', ['$location', function($location) {
    return {
        link: function(scope, element, attrs) {
            element.on('click', function() {
                scope.$apply(function() {
                    window.location = attrs.clickLink;
                });
            });
        }
    }
}]);
app.directive('autoHeight', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element = element[0];
            var resize = function(){
                element.style.height = 'auto';
                element.style.height = (element.scrollHeight || 48)+'px';
            };
            element.addEventListener('change', resize, false);
            element.addEventListener('cut',    resize, false);
            element.addEventListener('paste',  resize, false);
            element.addEventListener('drop',   resize, false);
            element.addEventListener('keydown',resize, false);

            setTimeout(resize, 100);
        }
    };
});




// Sezione JQuery
$(document)

	.on('shown.bs.modal','#Modal_CrtTextCode', function () {
		$("#Modal_CrtTextCode").find('#Modal_CrtTextCode_Input').focus().select();
	})
;









