main = angular.module('theme.core.main_controller', ['theme.core.services'])
main.controller('MainController', ['$scope', '$theme', '$timeout', 'progressLoader', '$rootScope', '$location', 'AuthenticationServiceUser',
    function($scope, $theme, $timeout, progressLoader, $rootScope, $location, AuthenticationServiceUser) {
    'use strict';
    // $scope.layoutIsSmallScreen = false;
    $scope.layoutFixedHeader = $theme.get('fixedHeader');
    $scope.layoutPageTransitionStyle = $theme.get('pageTransitionStyle');
    $scope.layoutDropdownTransitionStyle = $theme.get('dropdownTransitionStyle');
    $scope.layoutPageTransitionStyleList = ['bounce',
      'flash',
      'pulse',
      'bounceIn',
      'bounceInDown',
      'bounceInLeft',
      'bounceInRight',
      'bounceInUp',
      'fadeIn',
      'fadeInDown',
      'fadeInDownBig',
      'fadeInLeft',
      'fadeInLeftBig',
      'fadeInRight',
      'fadeInRightBig',
      'fadeInUp',
      'fadeInUpBig',
      'flipInX',
      'flipInY',
      'lightSpeedIn',
      'rotateIn',
      'rotateInDownLeft',
      'rotateInDownRight',
      'rotateInUpLeft',
      'rotateInUpRight',
      'rollIn',
      'zoomIn',
      'zoomInDown',
      'zoomInLeft',
      'zoomInRight',
      'zoomInUp'
    ];
    $scope.layoutLoading = true;
    $scope.getLayoutOption = function(key) {
      return $theme.get(key);
    };
    $scope.setNavbarClass = function(classname, $event) {
      $event.preventDefault();
      $event.stopPropagation();
      $theme.set('topNavThemeClass', classname);
    };
    $scope.setSidebarClass = function(classname, $event) {
      $event.preventDefault();
      $event.stopPropagation();
      $theme.set('sidebarThemeClass', classname);
    };
    $scope.$watch('layoutFixedHeader', function(newVal, oldval) {
      if (newVal === undefined || newVal === oldval) {
        return;
      }
      $theme.set('fixedHeader', newVal);
    });
    $scope.$watch('layoutLayoutBoxed', function(newVal, oldval) {
      if (newVal === undefined || newVal === oldval) {
        return;
      }
      $theme.set('layoutBoxed', newVal);
    });
    $scope.$watch('layoutLayoutHorizontal', function(newVal, oldval) {
      if (newVal === undefined || newVal === oldval) {
        return;
      }
      $theme.set('layoutHorizontal', newVal);
    });
    $scope.$watch('layoutPageTransitionStyle', function(newVal) {
      $theme.set('pageTransitionStyle', newVal);
    });
    $scope.$watch('layoutDropdownTransitionStyle', function(newVal) {
      $theme.set('dropdownTransitionStyle', newVal);
    });
    $scope.hideHeaderBar = function() {
      $theme.set('headerBarHidden', true);
    };
    $scope.showHeaderBar = function($event) {
      $event.stopPropagation();
      $theme.set('headerBarHidden', false);
    };
    $scope.toggleLeftBar = function() {
      if ($scope.layoutIsSmallScreen) {
        return $theme.set('leftbarShown', !$theme.get('leftbarShown'));
      }
      $theme.set('leftbarCollapsed', !$theme.get('leftbarCollapsed'));
    };
    $scope.toggleRightBar = function() {
      $theme.set('rightbarCollapsed', !$theme.get('rightbarCollapsed'));
    };
    $scope.toggleSearchBar = function($event) {
      $event.stopPropagation();
      $event.preventDefault();
      $theme.set('showSmallSearchBar', !$theme.get('showSmallSearchBar'));
    };
    $scope.chatters = [];
    $scope.currentChatterId = null;
    $scope.hideChatBox = function() {
      $theme.set('showChatBox', false);
    };
    $scope.toggleChatBox = function(chatter, $event) {
      $event.preventDefault();
      if ($scope.currentChatterId === chatter.id) {
        $theme.set('showChatBox', !$theme.get('showChatBox'));
      } else {
        $theme.set('showChatBox', true);
      }
      $scope.currentChatterId = chatter.id;
    };
    $scope.hideChatBox = function() {
      $theme.set('showChatBox', false);
    };
    $scope.$on('themeEvent:maxWidth767', function(event, newVal) {
      $timeout(function() {
        $scope.layoutIsSmallScreen = newVal;
        if (!newVal) {
          $theme.set('leftbarShown', false);
        } else {
          $theme.set('leftbarCollapsed', false);
        }
      });
    });
    $scope.$on('themeEvent:changed:fixedHeader', function(event, newVal) {
      $scope.layoutFixedHeader = newVal;
    });
    $scope.$on('themeEvent:changed:layoutHorizontal', function(event, newVal) {
      $scope.layoutLayoutHorizontal = newVal;
    });
    $scope.$on('themeEvent:changed:layoutBoxed', function(event, newVal) {
      $scope.layoutLayoutBoxed = newVal;
    });
    $scope.isLoggedIn = false;
    $scope.logOut = function() {
       AuthenticationServiceUser.ClearCredentials();
	    $scope.isLoggedIn = false;
	   $location.path('/login');
    };
    $scope.logIn = function() {
      $scope.isLoggedIn = true;
    };
    $scope.$on('logInUser', function(event, newVal) {
       $scope.isLoggedIn = true;
    });
	if(AuthenticationServiceUser.GetCredentials()){
		$scope.isLoggedIn = true;
	}
	//$scope.baseUrl = $browser.baseHref();
    $scope.rightbarAccordionsShowOne = false;
    $scope.rightbarAccordions = [{
      open: true
    }, {
      open: true
    }, {
      open: true
    }, {
      open: true
    }, {
      open: true
    }, {
      open: true
    }, {
      open: true
    }];
    $scope.$on('$routeChangeStart', function() {
      if ($location.path() === '') {
        return $location.path('/');
      }
     // progressLoader.start();
    //  progressLoader.set(50);
    });
    $scope.$on('$routeChangeSuccess', function() {
     // progressLoader.end();
      if ($scope.layoutLoading) {
        $scope.layoutLoading = false;
      }
    });
	
	$scope.show_about = function() {
		$rootScope.isMaincontent = false;
		$rootScope.interface = 'aboutus';
		$(".main_content").fadeOut(); 
		$(".course_section").fadeOut(); 
		$(".contact_section").fadeIn("slow"); 
    };
	$scope.show_course = function() {
		$rootScope.isMaincontent = false;
		$rootScope.interface = 'course';
		$(".main_content").fadeOut(); 
		$(".contact_section").fadeOut(); 
		$(".course_section").fadeIn("slow"); 
    };
	
 }]);






// Regsiter Step 1
main.controller('RegisterStep1Controller', ['$scope', '$filter', '$http', '$window', '$rootScope', '$routeParams', 'FlashService', function($scope, $filter, $http, $window, $rootScope, $routeParams, FlashService) {  
	$rootScope.bodylayout = 'black';
	$rootScope.interface = 'ansog';	
	var limit='';	 
 	$http.get('api/v1/checkstep1', {params: {limit: limit}}).success(function(reponse) {
		if(reponse.success){
			$scope.first_name = reponse.step1.first_name;
			$scope.last_name = reponse.step1.last_name;
			$scope.password = reponse.step1.password;
			$scope.cpassword = reponse.step1.password;
			$scope.zipcode = reponse.step1.zipcode;
			$scope.address = reponse.step1.address;
			$scope.city = reponse.step1.city;
			$scope.selectedCountry_id = reponse.step1.country_id;
		}


		
     });

	$http.get('api/v1/countries').success(function(countriesdropdown) {
		$scope.countriesdropdown = countriesdropdown
	});
	$scope.countriesListDropdown = function() {
		return this.countriesdropdown;
	}; 
	$scope.selectedCountryChanged = selectedCountryChanged;
	function selectedCountryChanged() {  
	alert('sel');
	}
	$scope.step1Create = step1Create;
	function step1Create() {  
		var formData = {first_name: $scope.first_name,
						last_name: $scope.last_name,
						password: $scope.password,
						zipcode: $scope.zipcode,
						address: $scope.address,
						city: $scope.city,
						country_id: $scope.selectedCountry_id
						}
		$http.post('api/v1/step1Create', formData).success(function(response) {
			//alert(response.success);
			//alert($scope.first_name);
			if(response.success){
				window.location = '#/ansog-trin2';
			}
		});				
	  }

	  
}]);

// Regsiter Step 2
main.controller('RegisterStep2Controller', ['$scope', '$filter', '$http', '$window', '$rootScope', '$routeParams', 'FlashService', function($scope, $filter, $http, $window, $rootScope, $routeParams, FlashService) {  
	$rootScope.bodylayout = 'black';
	$rootScope.interface = 'ansog';	
	var limit='';	 
 	$http.get('api/v1/checkstep2', {params: {limit: limit}}).success(function(reponse) {
		if(reponse.step1status){
			if(reponse.step2status){
				$scope.email = reponse.step2.email;
				$scope.phone = reponse.step2.phone;
				$scope.phone_at_work = reponse.step2.phone_at_work;
				$scope.gender_id = reponse.step2.gender_id;
				$scope.birth_day = reponse.step2.birth_day;
				$scope.birth_month = reponse.step2.birth_month;
				$scope.birth_year = reponse.step2.birth_year;
				$scope.ethinic_origin = reponse.step2.ethinic_origin;
			}
		}
		else{
			window.location = '#/ansog-trin1';
		}
	 });
	 
	
	$http.get('api/v1/years').success(function(yearsdropdown) {
		$scope.yearsdropdown = yearsdropdown
	});
	$scope.yearsListDropdown = function() {
		return this.yearsdropdown;
	}; 
	$http.get('api/v1/getstep2data', {params: {limit: limit}}).success(function(response) {
		$scope.gender=response.gender;
		//console.log($scope.gender);
	});
	$scope.step2Create = step2Create;
	function step2Create() {  
		var formData = {email: $scope.email,
						phone: $scope.phone,
						phone_at_work: $scope.phone_at_work,
						gender_id: $scope.gender_id,
						birth_day: $scope.birth_day,
						birth_month: $scope.birth_month,
						birth_year: $scope.birth_year,
						ethinic_origin: $scope.ethinic_origin
						}


		$http.post('api/v1/step2Create', formData).success(function(sucess) {
			if(sucess){
				window.location = '#/ansog-trin3';
			}
		});				
	  }

	  
}]);

// Regsiter Step 3
main.controller('RegisterStep3Controller', ['$scope', '$filter', '$http', '$window', '$rootScope', '$routeParams', 'FlashService', function($scope, $filter, $http, $window, $rootScope, $routeParams, FlashService) {  
	$rootScope.bodylayout = 'black';
	$rootScope.interface = 'ansog';	
	var limit='';
	
	$http.get('api/v1/checkstep2', {params: {limit: limit}}).success(function(reponse) {
		if(reponse.step1status){
			if(reponse.step2status){
				$scope.gender_id = reponse.step2.gender_id;
				$scope.age=reponse.age;
				
			}
		}
	});
	$http.get('api/v1/getstep3data', {params: {limit: limit}}).success(function(response) {
		$scope.gender=response.genders;
		$scope.eye_colors=response.eye_colors;
		$scope.hair_colors=response.hair_colors;
		console.log(response);
	});

	$scope.shirt_size_from	= '';	$scope.shirt_size_to= ''; 	$scope.pants_size_from	= ''; 	$scope.pants_size_to='';
	$scope.shoe_size_from 	= '';	$scope.shoe_size_to	= '';	$scope.suite_size_from 	= '';	$scope.suite_size_to= '';
	$scope.children_sizes 	= '';	$scope.eye_color_id = '';	$scope.hair_color_id 	= '';	$scope.bra_size 	= '';
	$scope.height 			= '';	$scope.weight 		= '';	 
 	$http.get('api/v1/checkstep3', {params: {limit: limit}}).success(function(reponse) {
		if((reponse.step1status) && (reponse.step2status)){
			if(reponse.step3status){
				$scope.shirt_size_from 	= reponse.step3.shirt_size_from;
				$scope.shirt_size_to 	= reponse.step3.shirt_size_to;
				$scope.pants_size_from 	= reponse.step3.pants_size_from;
				$scope.pants_size_to 	= reponse.step3.pants_size_to;
				$scope.shoe_size_from 	= reponse.step3.shoe_size_from;
				$scope.shoe_size_to 	= reponse.step3.shoe_size_to;
				$scope.suite_size_from 	= reponse.step3.suite_size_from;
				$scope.suite_size_to 	= reponse.step3.suite_size_to;
				$scope.children_sizes 	= reponse.step3.children_sizes;
				$scope.eye_color_id 	= reponse.step3.eye_color_id;
				$scope.hair_color_id 	= reponse.step3.hair_color_id;
				$scope.bra_size 		= reponse.step3.bra_size;
				$scope.height 			= reponse.step3.height;
				$scope.weight 			= reponse.step3.weight;
			}
		}
		else{
			window.location = '#/ansog-trin2';
		}
     });

	$scope.step3Create = step3Create;
	
	function step3Create() {  
		var formData = {shirt_size_from: $scope.shirt_size_from,
						shirt_size_to: $scope.shirt_size_to,
						pants_size_from: $scope.pants_size_from,
						pants_size_to: $scope.pants_size_to,
						shoe_size_from: $scope.shoe_size_from,
						shoe_size_to: $scope.shoe_size_to,
						suite_size_from: $scope.suite_size_from,
						suite_size_to: $scope.suite_size_to,
						children_sizes: $scope.children_sizes,
						eye_color_id: $scope.eye_color_id,
						hair_color_id: $scope.hair_color_id,
						bra_size: $scope.bra_size,
						height: $scope.height,
						weight: $scope.weight,
						}
		$http.post('api/v1/step3Create', formData).success(function(sucess) {
			if(sucess){
				window.location = '#/ansog-trin4';
			}
		});				
	  }

	  
}]);

// Regsiter Step 4
main.controller('RegisterStep4Controller', ['$scope', '$filter', '$http', '$window', '$rootScope', '$routeParams', 'FlashService', function($scope, $filter, $http, $window, $rootScope, $routeParams, FlashService) {  
	$rootScope.bodylayout = 'black';
	$rootScope.interface = 'ansog';	
	$scope.selectedcategories='';$scope.selectedskills='';$scope.selectedlicences='';$scope.notes='';$scope.job='';
	var limit='';	 

	$http.get('api/v1/getcategories').success(function(categoriesdropdown) {
		$scope.categoriesdropdown = categoriesdropdown
	});
	$http.get('api/v1/getskills').success(function(skillsdropdown) {
		$scope.skillsdropdown = skillsdropdown
	});
	$http.get('api/v1/getlicences').success(function(licencesdropdown) {
		$scope.licencesdropdown = licencesdropdown
	});

 	$http.get('api/v1/checkstep4', {params: {limit: limit}}).success(function(response) {
		if((response.step1status) && (response.step2status) && (response.step3status)){
			if(response.step4status){
				$scope.notes 	= response.step4.notes;
				$scope.job 	= response.step4.job;
				$scope.selectedcategories 	= response.step4.selectedcategories;
				$scope.selectedskills 	= response.step4.selectedskills;
				$scope.selectedlicences 	= response.step4.selectedlicences;
				if($scope.selectedcategories){
					var selscats1 = $scope.selectedcategories.split(',');
					for (i = 0; i < selscats1.length; i++) {
						var curcatid = selscats1[i];
						var myElBut = angular.element( document.querySelector( '#catbut'+curcatid ) );
						var myElSpan = angular.element( document.querySelector( '#catspan'+curcatid ) );
						myElBut.removeClass('button1').addClass('button2');
						myElSpan.removeClass('plus-icon').addClass('close-icon');
					}
				}
				if($scope.selectedskills){
					var selskill1 = $scope.selectedskills.split(',');
					for (i = 0; i < selskill1.length; i++) {
						var curskillid = selskill1[i];
						var myElBut = angular.element( document.querySelector( '#skillbut'+curskillid ) );
						var myElSpan = angular.element( document.querySelector( '#skillspan'+curskillid ) );
						myElBut.removeClass('button1').addClass('button2');
						myElSpan.removeClass('plus-icon').addClass('close-icon');
					}
				}
				if($scope.selectedlicences){
					var selslic1 = $scope.selectedlicences.split(',');
					for (i = 0; i < selslic1.length; i++) {
						var curlicid = selslic1[i];
						var myElBut = angular.element( document.querySelector( '#licbut'+curlicid ) );
						var myElSpan = angular.element( document.querySelector( '#licspan'+curlicid ) );
						myElBut.removeClass('button1').addClass('button2');
						myElSpan.removeClass('plus-icon').addClass('close-icon');
					}
				}
			}
		}else{
			window.location = '#/ansog-trin3';
		}
     });

	$scope.checkuncheckcategory = checkuncheckcategory;
	function checkuncheckcategory(catid) {  
		var myElBut = angular.element( document.querySelector( '#catbut'+catid ) );
		var myElSpan = angular.element( document.querySelector( '#catspan'+catid ) );
		myElBut.toggleClass('button1').toggleClass('button2');
		myElSpan.toggleClass('plus-icon').toggleClass('close-icon');
		var selcats = new Array();
		if($scope.selectedcategories){
			 selcats = $scope.selectedcategories.split(',');
			 var selindex = selcats.indexOf(catid);
			if( selindex !== -1) {
					selcats.splice(selindex, 1); 
			}else{
					selcats.push(catid);
			}
		}else{
			
			if(myElBut.hasClass('button2'))
				 selcats.push(catid);
		}
		$scope.selectedcategories = selcats.toString();
	};
	
	$scope.checkuncheckskill = checkuncheckskill;
	function checkuncheckskill(skillid) {  
		var myElBut = angular.element( document.querySelector( '#skillbut'+skillid ) );
		var myElSpan = angular.element( document.querySelector( '#skillspan'+skillid ) );
		myElBut.toggleClass('button1').toggleClass('button2');
		myElSpan.toggleClass('plus-icon').toggleClass('close-icon');
		var selskills = new Array();
		if($scope.selectedskills){
			 selskills = $scope.selectedskills.split(',');
			 var selindex = selskills.indexOf(skillid);
			if(selindex !== -1) {
				selskills.splice(selindex, 1); 
			}else{
				selskills.push(skillid);
			}
		}else{
			if(myElBut.hasClass('button2'))
				 selskills.push(skillid);
		}
		$scope.selectedskills = selskills.toString();
		
	};
	
	$scope.checkunchecklicence = checkunchecklicence;
	function checkunchecklicence(licid) {  
		var myElBut = angular.element( document.querySelector( '#licbut'+licid ) );
		var myElSpan = angular.element( document.querySelector( '#licspan'+licid ) );
		myElBut.toggleClass('button1').toggleClass('button2');
		myElSpan.toggleClass('plus-icon').toggleClass('close-icon');
		var sellics = new Array();
		if($scope.selectedlicences){
			 sellics = $scope.selectedlicences.split(',');
			 var selindex = sellics.indexOf(licid);
			if( selindex !== -1) {
				sellics.splice(selindex, 1); 
			}else{
				sellics.push(licid);
			}
		}else{
			if(myElBut.hasClass('button2'))
				 sellics.push(licid);
		}
		$scope.selectedlicences = sellics.toString();
	};
	
	$scope.step4Create = step4Create;
	function step4Create() {  
		var formData = {notes: $scope.notes,
						job: $scope.job,
						selectedcategories: $scope.selectedcategories,
						selectedskills: $scope.selectedskills,
						selectedlicences: $scope.selectedlicences
						}
		$http.post('api/v1/step4Create', formData).success(function(sucess) {
			if(sucess){
				window.location = '#/ansog-trin5';
			}
		});				
	  }

	  
}]);

// Regsiter Step 5
main.controller('RegisterStep5Controller', ['$scope', '$filter', '$http', '$window', '$rootScope', '$routeParams', 'FlashService', function($scope, $filter, $http, $window, $rootScope, $routeParams, FlashService) {  
	$rootScope.bodylayout = 'black';
	$rootScope.interface = 'ansog';	
	var limit='';	 
	$http.get('api/v1/getlanguages').success(function(languagesdropdown) {
		$scope.languagesdropdown = languagesdropdown
	});
	$scope.languagesListDropdown = function() {
		return this.languagesdropdown;
	}; 
	
	$http.get('api/v1/getlanguageratings').success(function(languageratings) {
		$scope.languageratings = languageratings
	});

	$scope.setlangraing = setlangraing;
	function setlangraing(langrowid,langrateid) {  
		if($('#lang'+langrowid).val()) {
			for (i = 1; i <= 4; i++) {
				if(i <= langrateid)
					$('#start_'+langrowid+'_'+i).attr('src','images/star-white.png');
				else
					$('#start_'+langrowid+'_'+i).attr('src','images/star-black.png');
			}
			$('#langrateval'+langrowid).val(langrateid);
		}
	};
 	$http.get('api/v1/checkstep5', {params: {limit: limit}}).success(function(response) {
		if((response.step1status) && (response.step2status) && (response.step3status) && (response.step4status)){
			if(response.step5status){
				$scope.lang1 = response.step5.lang1;
				$scope.lang2 = response.step5.lang2;
				$scope.lang3 = response.step5.lang3;
				$scope.lang4 = response.step5.lang4;
				$scope.langrateval1 = response.step5.langrateval1;
				$scope.langrateval2 = response.step5.langrateval2;
				$scope.langrateval3 = response.step5.langrateval3;
				$scope.langrateval4 = response.step5.langrateval4;
				$scope.dealekter1 = response.step5.dealekter1;
				$scope.dealekter2 = response.step5.dealekter2;
				$scope.dealekter3 = response.step5.dealekter3;
				if($scope.langrateval1){
					var selrateval = $scope.langrateval1;
					for (i = 1; i <=4; i++) {
						if(i <= selrateval)
							$('#start_1_'+i).attr('src','images/star-white.png');
					}
				}
				if($scope.langrateval2){
					var selrateval = $scope.langrateval2;
					for (i = 1; i <=4; i++) {
						if(i <= selrateval)
							$('#start_2_'+i).attr('src','images/star-white.png');
					}
				}
				if($scope.langrateval3){
					var selrateval = $scope.langrateval3;
					for (i = 1; i <=4; i++) {
						if(i <= selrateval)
							$('#start_3_'+i).attr('src','images/star-white.png');
					}
				}
				if($scope.langrateval4){
					var selrateval = $scope.langrateval4;
					for (i = 1; i <=4; i++) {
						if(i <= selrateval)
							$('#start_4_'+i).attr('src','images/star-white.png');
					}
				}
			}
		}else{
				window.location = '#/ansog-trin4';
		}
     });
	$scope.step5Create = step5Create;
	function step5Create() {  
			

		var formData = {lang1: $scope.lang1,
						lang2: $scope.lang2,
						lang3: $scope.lang3,
						lang4: $scope.lang4,
						langrateval1: $('#langrateval1').val(),
						langrateval2: $('#langrateval2').val(),
						langrateval3: $('#langrateval3').val(),
						langrateval4: $('#langrateval4').val(),
						dealekter1: $scope.dealekter1,
						dealekter2: $scope.dealekter2,
						dealekter3: $scope.dealekter3
						}
		$http.post('api/v1/step5Create', formData).success(function(sucess) {
			if(sucess){
				window.location = '#/ansog-trin6';
			}
		});				
	  }

	  
}]);

// Regsiter Step 6
main.controller('RegisterStep6Controller', ['$scope', '$filter', '$http', '$window', '$rootScope', '$routeParams', 'FlashService', function($scope, $filter, $http, $window, $rootScope, $routeParams, FlashService) {  
	$rootScope.bodylayout = 'black';
	$rootScope.interface = 'ansog';	
	var limit='';	 
	$scope.files = []; 
	$scope.agree;
	$scope.ifRegistring=false;
 	// $http.get('api/v1/step6', {params: {limit: limit}}).success(function(lostepets) {
	//  });
	$http.get('api/v1/checkstep5', {params: {limit: limit}}).success(function(response) {
		if((!response.step1status) && (!response.step2status) && (!response.step3status) && (!response.step4status)){
			window.location = '#/ansog-trin4';
		}
	});
		
	
	$http.get('api/v1/countries').success(function(countriesdropdown) {
		$scope.countriesdropdown = countriesdropdown
	});
	$scope.countriesListDropdown = function() {
		return this.countriesdropdown;
	}; 
	
	$scope.step6Create = step6Create;
	function step6Create() {  
		$scope.ifRegistring=true;
		

		var fd = new FormData();
		angular.forEach($scope.files,function(file){
		  fd.append('Image_file[]',file._file);
		});
		angular.forEach($scope.videos,function(video){
			fd.append('Video_file[]',video._file);
		  });
	
		$http.post('api/v1/step6Create',  fd, 
					{
						transformRequest: angular.identity,
						headers: {'Content-Type': undefined,'Process-Data': false}
					}
					).success(function(response) {
						
					if(response.status){
						$scope.ifRegistring=false;
						alert("Registered Successfully");
						window.location = '#/index';
					}
					else{
						alert("Couldn't Register, Please Try again later");
						window.location = '#/index';
					}
					
			
			}).error(function(error){
				alert('Something went wrong, Please try again later'); 
				window.location = '#/index';
			});				
	  }

	  
}]);

main.directive('ngFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
				var values = [];
			
				var value = {
					
					 name: element[0].files[0].name,
					 size: element[0].files[0].size,
					 url: URL.createObjectURL(element[0].files[0]),
					 _file: element[0].files[0]
				 };
				 
				 values.push(value);
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    };
}]);
// Regsiter Step 7
main.controller('RegisterStep7Controller', ['$scope', '$filter', '$http', '$window', '$rootScope', '$routeParams', 'FlashService', function($scope, $filter, $http, $window, $rootScope, $routeParams, FlashService) {  
	$rootScope.bodylayout = 'black';
	$rootScope.interface = 'ansog';	
	var limit='';	 
 	$http.get('api/v1/step7', {params: {limit: limit}}).success(function(lostepets) {
     });
	$http.get('api/v1/countries').success(function(countriesdropdown) {
		$scope.countriesdropdown = countriesdropdown
	});
	$scope.countriesListDropdown = function() {
		return this.countriesdropdown;
	}; 
	
	$scope.step7Create = step7Create;
	function step7Create() {  
		var formData = {first_name: $scope.first_name,
						last_name: $scope.last_name,
						password: $scope.password,
						zipcode: $scope.zipcode,
						address: $scope.address,
						city: $scope.city,
						country_id: $scope.country_id
						}
		$http.post('api/v1/step7Create', formData).success(function(sucess) {
			if(sucess){
				window.location = '#/success';
			}
		});				
	  }

	  
}]);

// Footer
main.controller('FooterController', ['$scope', '$filter', '$http', '$window', '$rootScope', '$routeParams', 'FlashService', function($scope, $filter, $http, $window, $rootScope, $routeParams, FlashService) {}]);








//Update Profile details   
main.controller('MyProfileController', ['$scope', '$filter', '$http', '$window', '$routeParams', 'FlashService', function($scope, $filter, $http, $window, $routeParams, FlashService) {  
$('#headerlogo').show();
	$('.preloader').show().delay(2000).fadeOut(1000);
	
	 var playerid = 'myprofile';	
	 $http.get('api/v1/myprofiledetails', {params: {id: playerid}}).success(function(cusdata) {
		//alert(cusdata.customer['owner_name']);
		 
		$.each(cusdata.customer, function(key, data) {
			$scope[key] = data;
		});
		//var pets = [];
		//$.each(cusdata.custpets, function(key, data) {
			//alert(data['pet_id']);
		//pets.push(data)
		//});
     });
	 
	 $http.get('api/v1/mypetdetails', {params: {id: playerid}}).success(function(petdata) {
	 $scope.pets=petdata;
     });
	 
	 $scope.Button = Button;
	 function Button(type) {  
		$scope.submittype = type;
	 } 
	 $scope.edit_pet = edit_pet;
	 function edit_pet(petid) {  
		window.location = '#/edit-pet/'+petid;
	 } 
	  
	 $scope.profileUpdate = profileUpdate;
	 
	 function profileUpdate() {  
		var formData = {playerid: $scope.playerid,shirt_size: $scope.shirt_size,
						 fname: $scope.fname,lname: $scope.lname,gender: $scope.gender,
						 email: $scope.email,address_1: $scope.address_1,address_2: $scope.address_2,city: $scope.city,post: $scope.post,region: $scope.region,country: $scope.country,phone_1: $scope.phone_1,phone_2: $scope.phone_2,status: $scope.status,submittype: $scope.submittype, user_id:$scope.user_id
						}
		$http.post('api/v1/customerupdate', formData).success(function(customer) {
			if(customer.sucess){
				if(customer.type=='save') {
					$window.scrollTo(0, 0);
					FlashService.Success(customer.message);
					
					//window.location = '#/customer-management';
				}
				else {
					window.location = '#/tshirt-management';
				}
			}  
		});				
	  }
				
	$scope.ViewCustomer = function() {  
		window.location = '#/view-customer/'+$scope.playerid;
	}
	$scope.AddNewCustomer = function() {  
		window.location = '#/add-new-user/';
	}
}]);
 
//Update Customer details   
main.controller('EditUserController', ['$scope', '$filter', '$http', '$window', '$routeParams', 'FlashService', function($scope, $filter, $http, $window, $routeParams, FlashService) {  
	$('#headerlogo').show();
	$('.preloader').show().delay(2000).fadeOut(1000);
	
	 var playerid = $routeParams.id;	
	 
	 $http.get('api/v1/getprofiledetails', {params: {id: playerid}}).success(function(cusdata) {
		 
		 $.each(cusdata.customer, function(key, data) {
			$scope[key] = data;
		});
		
     });
	 
	 $scope.Button = Button;
	 function Button(type) {  
		$scope.submittype = type;
	 } 
	  
	 $scope.go_to_profile = go_to_profile;
	 function go_to_profile(type) {  
		window.location = '#/my-profile';
	 } 
	 $scope.customerUpdate = customerUpdate;
	 
	 function customerUpdate() {  
		var formData = {playerid: $scope.playerid,shirt_size: $scope.shirt_size,
						 fname: $scope.fname,lname: $scope.lname,gender: $scope.gender,
						 email: $scope.email,address_1: $scope.address_1,address_2: $scope.address_2,city: $scope.city,post: $scope.post,region: $scope.region,country: $scope.country,phone_1: $scope.phone_1,phone_2: $scope.phone_2, password: $scope.npassword, status: $scope.status,submittype: 'save', user_id:$scope.user_id
						}
		$http.post('api/v1/updateprofile', formData).success(function(customer) {
			if(customer.sucess){
				if(customer.type=='save') {
					$window.scrollTo(0, 0);
					$scope.npassword ='';
					$scope.cnpassword ='';
					FlashService.Success(customer.message);
					//window.location = '#/customer-management';
				}
				else {
					FlashService.Error(customer.message);
					window.location = '#/edit-profile';
				}
			}  
		});				
	  }
				
	$scope.ViewCustomer = function() {  
		window.location = '#/view-customer/'+$scope.playerid;
	}
	$scope.AddNewCustomer = function() {  
		window.location = '#/add-new-user/';
	}
}]);
//Update Customer details   
main.controller('ViewUserController', ['$scope', '$filter', '$http', '$window', '$routeParams', 'FlashService', function($scope, $filter, $http, $window, $routeParams, FlashService) {  
	$('#headerlogo').show();
	$('.preloader').show().delay(2000).fadeOut(1000);
	
	 var playerid = $routeParams.id;	
	 
	 $http.get('api/v1/customerbyid', {params: {id: playerid}}).success(function(cusdata) {
		 
		 $.each(cusdata.customer, function(key, data) {
			 if(key == 'payment_status') {
				 data = (data==0)?'Not Paid':'Paid';
			 }
			$scope[key] = data;
		});
		
		if(cusdata.tryout!='') { 
			var weekday = new Array(7);
				weekday[0]=  "Sunday";
				weekday[1] = "Monday";
				weekday[2] = "Tuesday";
				weekday[3] = "Wednesday";
				weekday[4] = "Thursday";
				weekday[5] = "Friday";
				weekday[6] = "Saturday";
		 
			$scope.tryout_name = cusdata.tryout.name
			$scope.tryout_division = cusdata.tryout.division
			$scope.tryout_date = cusdata.tryout.date
			var d = new Date(cusdata.tryout.time); 
			$scope.tryout_day = weekday[d.getDay()]
			var hour = d.getHours(); 
			var min = d.getMinutes(); 
			var time = hour +":"+ min;
			$scope.tryout_time = time;
		}
     });
	 
	 $scope.Button = Button;
	 function Button(type) {  
		$scope.submittype = type;
	 } 
	  
	 $scope.customerUpdate = customerUpdate;
	 
	 function customerUpdate() {  
		var formData = {playerid: $scope.playerid,shirt_size: $scope.shirt_size,
						 firstname: $scope.firstname,lastname: $scope.lastname,gender: $scope.gender,
						 dob: $scope.dob,nationality: $scope.nationality,street_address: $scope.street_address,school_attending: $scope.school_attending,home_phone: $scope.home_phone,email: $scope.email,civil_id: $scope.civil_id,numyrs_played: $scope.numyrs_played,division: $scope.division,numyrs_tournteam: $scope.numyrs_tournteam,lastdiv_played: $scope.lastdiv_played,playedprevious_league: $scope.playedprevious_league,played_howmanyyrs: $scope.played_howmanyyrs,special_request: $scope.special_request,gender: $scope.gender,
						 league_comments: $scope.league_comments,amount: $scope.amount,payment_status: $scope.payment_status,fathername: $scope.fathername,father_workphone: $scope.father_workphone,father_mobile: $scope.father_mobile,father_employer: $scope.father_employer,father_occupation: $scope.father_occupation,father_email: $scope.father_email,father_volunteer: $scope.father_volunteer,mothername: $scope.mothername,mother_workphone: $scope.mother_workphone,mother_mobile: $scope.mother_mobile,mother_employer: $scope.mother_employer,mother_occupation: $scope.mother_occupation,mother_email: $scope.mother_email,mother_volunteer: $scope.mother_volunteer,player_mediconditions: $scope.player_mediconditions,emergency_contact: $scope.emergency_contact,relationship: $scope.relationship,contact_number: $scope.contact_number,insurance_carrier: $scope.insurance_carrier,policy_number: $scope.policy_number,submittype: $scope.submittype
						}
		$http.post('api/v1/customerupdate', formData).success(function(customer) {
			if(customer.sucess){
				if(customer.type=='save') {
					$window.scrollTo(0, 0);
					FlashService.Success(customer.message);
					
					//window.location = '#/customer-management';
				}
				else {
					window.location = '#/tshirt-management';
				}
			}  
		});				
	  }
	    var el = this;
		var defaults = {
						separator: ',',
						ignoreColumn: [],
						tableName:'yourTableName',
						type:'excel',
						pdfFontSize:14,
						pdfLeftMargin:20,
						escape:'true',
						htmlContent:'false',
						consoleLog:'false'
				};
				
	$scope.PrintPDf = function() { 
			//var pdf = new jsPDF('p','pt','a4');
			 
			var pdf = new jsPDF('p','pt','a4');
			var source = $('.form-horizontal').first();
			//var name =  $scope.firstname
			pdf.addHTML(source,function() {
				pdf.save('player_details.pdf')
				
				//var string = pdf.output('datauristring');
				//$('.preview-pane').attr('src', string);
			});
	}
	
}]);
// Update Account Details
main.controller('EditAccountController', ['$scope', '$filter', '$http', '$window', '$rootScope', 'FlashService', function($scope, $filter, $http, $window, $rootScope, FlashService) {  
	$('#headerlogo').show();
	$('.preloader').show().delay(2000).fadeOut(1000);
	
	 
	var logged = '';
	var userid = '';
	logged = $rootScope.globals.currentUser
	userid = ( logged )?logged.userid:'';
	
	 $http.get('api/v1/account', {params: {userid: userid}}).success(function(user) {
		 //console.log(user)
		 $scope.userid = userid;
		 $scope.email = user.email;	
     });
	 $scope.password = '';
	 
	 $scope.accountUpdate = accountUpdate;
	 
	 function accountUpdate() { 
		var formData = {userid: userid, email: $scope.email,
						userid: $scope.userid, password: $scope.password
						}
		$http.post('api/v1/accountupdate', formData).success(function(tshirt) {
			if(tshirt.sucess){
				$window.scrollTo(0, 0);
				FlashService.Success(tshirt.message);
			}  
		});				
	  }
}]);



main.controller('PaymentController', ['$scope', '$rootScope', '$cookieStore', '$filter', '$http', '$window', '$routeParams', 'FlashService', function($scope, $rootScope, $cookieStore, $filter, $http, $window, $routeParams, FlashService) {  
	 
 	 $scope.petid =  $cookieStore.get('petid');
	 
	 if($scope.petid!='') { 
		 var loggedIn  = $rootScope.globals.currentUser;
		 $scope.userid = loggedIn.userid;
		 $scope.amount = 100;
		 $scope.paystatus =  $cookieStore.get('paystatus');
		 if($scope.paystatus) {
			 $scope.message = 'Success! You have completed your registration. Please pay and activate your pet.'
		 }
		 else {
			$scope.message = 'Success! You have completed your registration.' 
		 }
		 $scope.click_pay = click_pay;
		 
		 function click_pay() {  
			var formData = {petid: $scope.petid,
							userid: $scope.userid,
							}
			$http.post('api/v1/paymentInstamojo', formData).success(function(pay) {
				if(pay.success){
					window.location = pay.url;
				}	
				else {
					$scope.paymentfailed = pay.message
					//window.location = '#/add-new-chip';
				}  
			});				
		  }
	}
	else {
		window.location = '#/add-new-pet';
	}	
				
}]);
main.controller('PaymentResponseController', ['$scope', '$rootScope', '$cookieStore', '$filter', '$http', '$window', '$routeParams', 'FlashService', function($scope, $rootScope, $cookieStore, $filter, $http, $window, $routeParams, FlashService) { 
	$scope.petid =  $cookieStore.get('petid');
	
	if($scope.petid!='') {
	 $scope.payment_request_id = $routeParams.payment_request_id;
	 $scope.payment_id = $routeParams.payment_id;
	 $scope.petid =  $cookieStore.get('petid');
	 $scope.userid = $cookieStore.get('user_id');
	 
		var formData = { petid: $scope.petid,
						 userid: $scope.userid,
						 payment_request_id: $scope.payment_request_id,
						 payment_id: $scope.payment_id,
					   }
		$http.post('api/v1/paymentResponse', formData).success(function(pay) {
			$scope.title = pay.title;
			$scope.message = pay.message;
			$scope.error = pay.error;
			$scope.paymentid = pay.paymentid;
			
			$cookieStore.put('petid', '');
			$cookieStore.put('user_id', '');
		});	
	}
	else {
		window.location = '#/add-new-pet';
	}	
}]);
main.controller('PaymentRegisterController', ['$scope', '$rootScope', '$cookieStore', '$filter', '$http', '$window', '$routeParams', 'FlashService', function($scope, $rootScope, $cookieStore, $filter, $http, $window, $routeParams, FlashService) {  
	 
 	 $scope.petid =  $cookieStore.get('petid');
	 
	 if($scope.petid!='') { 
		 $scope.userid = $cookieStore.get('user_id');
		 $scope.amount = 100;
		 $scope.paystatus =  $cookieStore.get('paystatus');
		 if($scope.paystatus) {
			 $scope.message = 'Success! You have completed your registration. Please pay and activate your pet.'
		 }
		 else {
			$scope.message = 'Success! You have completed your registration.' 
		 }
		 
		 $scope.click_pay = click_pay;
		 
		 function click_pay() {  
			var formData = {petid: $scope.petid,
							userid: $scope.userid,
							}
			$http.post('api/v1/paymentRegisterInstamojo', formData).success(function(pay) {
				if(pay.success){
					window.location = pay.url;
				}	
				else {
					$scope.paymentfailed = pay.message
					//window.location = '#/add-new-chip';
				}  
			});				
		  }
	}
	else {
		window.location = '#/register-step1';
	}	
				
}]);
main.controller('PaymentRegisterResponseController', ['$scope', '$rootScope', '$cookieStore', '$filter', '$http', '$window', '$routeParams', 'FlashService', function($scope, $rootScope, $cookieStore, $filter, $http, $window, $routeParams, FlashService) { 
	$scope.petid =  $cookieStore.get('petid');
	
	if($scope.petid!='') {
	 $scope.payment_request_id = $routeParams.payment_request_id;
	 $scope.payment_id = $routeParams.payment_id;
	 $scope.petid =  $cookieStore.get('petid');
	 $scope.userid = $cookieStore.get('user_id');
	 
		var formData = { petid: $scope.petid,
						 userid: $scope.userid, 	
						 payment_request_id: $scope.payment_request_id,
						 payment_id: $scope.payment_id,
					   }
		$http.post('api/v1/paymentResponse', formData).success(function(pay) {
			$scope.title = pay.title;
			$scope.message = pay.message;
			$scope.error = pay.error;
			$scope.paymentid = pay.paymentid;
			
			$cookieStore.put('petid', '');
			$cookieStore.put('user_id', '');
		});	
	}
	else {
		window.location = '#/register-step1';
	}	
}]);
main.controller('Imageupload',['$scope', function($scope) {
    $scope.myImage='';
    $scope.myCroppedImage='';
	
    var handleFileSelect=function(evt) { 
      var file=evt.currentTarget.files[0];
	  
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
		  //alert($scope.myImage)
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
  }]);
// Update Account Details
main.controller('footerController', ['$scope', '$filter', '$http', '$window', '$rootScope', 'FlashService', '$timeout', function($scope, $filter, $http, $window, $rootScope, FlashService, $timeout) {  
	 $scope.newsletterSubscribe = newsletterSubscribe;
	 
	 function newsletterSubscribe() { 
		 $scope.successmsg = '';
		 $scope.errormsg = '';
		 $scope.showsuccess = 0;
		 $scope.showerror = 0;
		var formData = {email: $scope.emailaddress,}
		$http.post('api/v1/newsletterSubscribe', formData).success(function(emailStatus) {
			if(emailStatus.sucess){
				$scope.emailaddress = '';
				$scope.newsletter_form.$setPristine();
				  $scope.showsuccess = 1; 
				 $scope.successmsg = emailStatus.message;
				 $timeout(function () { 
					 $scope.showsuccess = 0; 
					 $scope.successmsg = '';
				 }, 4000);   
				
			}  
			else{
					$scope.showerror = 1;
					$scope.errormsg = emailStatus.message;
				$timeout(function () { 
					$scope.showerror = 0;
					$scope.errormsg = '';
				 }, 4000);   
				
			}
		});				
	  }
}]);
// Verify OTP
main.controller('VerifyOTP', ['$scope', '$filter', '$cookieStore', '$http', '$window',  '$rootScope', 'FlashService', '$timeout', function($scope, $filter, $cookieStore, $http, $window, $rootScope, FlashService, $timeout) {  
	 
	 $scope.otpValidate = otpValidate;
	 
	 function otpValidate() { 
		 //alert($scope.otp)
		var formData = {otp: $scope.otp}
		$http.post('api/v1/verifyOTP', formData).success(function(otpStatus) {
			if(otpStatus.success){
				parent.$.fancybox.close();
				$cookieStore.put('otpvalidation', true);
				
				window.location = '#/register-step3';
			}  
			else{
				$scope.message = 	otpStatus.message;
			}
		});				
	  }
}]);

// User Password reset controller

main.controller('UserPasswordResetController', ['$scope', '$filter', '$http', '$window', '$rootScope', 'FlashService', function($scope, $filter, $http, $window, $rootScope, FlashService) { 
	$('#headerlogo').show(); 
	$('.preloader').show().delay(2000).fadeOut(1000);
	 
	var logged = '';
	var userid = '';
	logged = $rootScope.globals.currentUser
	userid = ( logged )?logged.userid:'';
	if(userid){
		window.location = '#/my-profile';
	}
	/*$http.get('api/v1/account', {params: {userid: userid}}).success(function(user) {
		 //console.log(user)
		 $scope.userid = userid;
		 $scope.email = user.email;	
     });*/
	 $scope.password = '';
	 
	 $scope.resetPassword = resetPassword;
	 
	 function resetPassword() { 
		var formData = {email: $scope.email	}
		$http.post('api/v1/resetpassword', formData).success(function(tshirt) {
			if(tshirt.success){
				FlashService.Success(tshirt.message);
			}  
			else{
				FlashService.Error(tshirt.message);
			}
		});				
	  }
}]);

