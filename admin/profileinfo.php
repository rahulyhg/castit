<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);
//include database connection file
require_once 'dbHelper.php';
require_once 'src/functions.php';
$db = new dbHelper();

if(isset($_GET['id']) && is_numeric($_GET['id'])){
  $id = $_GET['id'];
  $query_string = "SELECT * from profiles WHERE id='".$id."'";
  $user_profile_query = $db->prepare($query_string);
  $user_profile_query->execute();
  $row = $user_profile_query->rowCount();
}
else{
  $email = explode("email=", $_POST['PHPSESSID'])[1];
  $query_string = "SELECT * from profiles WHERE email='".$email."'";
  $user_profile_query = $db->prepare($query_string);
  $user_profile_query->execute();
  $row = $user_profile_query->rowCount();
}

  $query_country = $db->prepare("SELECT * FROM countries order by name"); 
	$query_country->execute();
	$country_list = $query_country->fetchAll(PDO::FETCH_ASSOC);

  $eye_colors = $db->prepare("SELECT * FROM eye_colors ORDER BY sortby"); 
	$eye_colors->execute();
  $eye_colors_list = $eye_colors->fetchAll(PDO::FETCH_ASSOC);

	$hair_colors = $db->prepare("SELECT * FROM hair_colors ORDER BY sortby"); 
	$hair_colors->execute();
  $hair_colors_list = $hair_colors->fetchAll(PDO::FETCH_ASSOC);

	$gender = $db->prepare("SELECT * FROM genders"); 
	$gender->execute();
  $gender_list = $gender->fetchAll(PDO::FETCH_ASSOC);

	$category = $db->prepare("SELECT * FROM categories"); 
	$category->execute();
  $category_list = $category->fetchAll(PDO::FETCH_ASSOC);

	$skills = $db->prepare("SELECT * FROM skills"); 
	$skills->execute();
  $skills_list = $skills->fetchAll(PDO::FETCH_ASSOC);

  $licences = $db->prepare("SELECT * FROM drivers_licenses"); 
	$licences->execute();
  $licences_list = $licences->fetchAll(PDO::FETCH_ASSOC);

  $language = $db->prepare("SELECT * FROM language_proficiency_languages"); 
	$language->execute();
  $language_list = $language->fetchAll(PDO::FETCH_ASSOC);


  if ($row > 0){
  foreach ($user_profile_query->fetchAll(PDO::FETCH_ASSOC) as $key => $value) {
    
    $pid = $value['id'];
    $category_query = $db->prepare("SELECT category_id FROM categories_profiles where profile_id = $pid");
    $category_query->execute();
    foreach ($category_query->fetchAll(PDO::FETCH_ASSOC) as $ct_item){
      $value['categories'][] = $ct_item['category_id'];
    }

    $skill_query = $db->prepare("SELECT skill_id FROM profiles_skills where profile_id = $pid");
    $skill_query->execute();
    foreach ($skill_query->fetchAll(PDO::FETCH_ASSOC) as $sk_item){
      $value['skills'][] = $sk_item['skill_id'];
    }

    $license_query = $db->prepare("SELECT drivers_license_id FROM drivers_licenses_profiles where profile_id = $pid");
    $license_query->execute();
    foreach ($license_query->fetchAll(PDO::FETCH_ASSOC) as $lc_item){
      $value['licenses'][] = $lc_item['drivers_license_id'];
    }

    $language_query = $db->prepare("SELECT distinct language_proficiency_language_id as lpli, id, language_proficiency_rating_id FROM language_proficiencies where profile_id = $pid group by lpli");
    $language_query->execute();
    foreach ($language_query->fetchAll(PDO::FETCH_ASSOC) as $lng_item){
      $value['languages'][] = ['lang_id'=>$lng_item['lpli'], 'rating'=>$lng_item['language_proficiency_rating_id'],'lng_pro_id'=>$lng_item['id']];
    }

    $payment_query = $db->prepare("SELECT * from payments where profile_id = $pid");
    $payment_query->execute();
    foreach($payment_query->fetchAll(PDO::FETCH_ASSOC) as $payment){
      $value['payments'][] = ['payment_type_id'=>$payment['payment_type_id'], 'applies'=>$payment['applies'], 'paid'=>$payment['paid'], 'description'=>$payment['description']];
    }

    $birthday = explode('-', $value['birthday']);
    $value['birth_day'] = $birthday[2];
    $value['birth_month'] = $birthday[1];
    $value['birth_year'] = $birthday[0];
    $user_profile = json_encode($value);
  }
  $json_profile_info = json_encode($value);
} 
else{
  // echo 'wrong';
}
// pp($value);
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Castit</title>
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<link href="css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
<link href="css/bootstrap-toggle.css" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
	
<body>
<div id="wrapper">
  <header id="header">
  		<div class="container">
  		<div class="logo"><a href="#"><img src="images/logo.png" alt=""></a></div>
        
    	<div id="navbar">    
              <nav class="navbar navbar-default navbar-static-top" role="navigation">
                        <div class="navbar-header">
                            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse-1">
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                            </button>
                        </div>
                        
                        <div class="collapse navbar-collapse" id="navbar-collapse-1">
                            <ul class="nav navbar-nav">
                                <li class="current-menu-item"><a href="/admin">Profiler</a></li>
                                <li><a href="#">opret job</a></li>
                                <li><a href="#">too do</a></li>
                                <li><a href="#">tekst</a></li>
                                <li><a href="#">intro billeder</a></li>
                                <li><a href="#">alle profiler</a></li>	
                            </ul>
                        </div><!-- /.navbar-collapse -->
                    </nav>
            </div>
            
            </div>
  </header><!--close header-->
	
	
	
	
  
  <div id="content"> 
	  
       <div class="page-top page-top2">
       		<div class="container">
            	 <h2>Anders. CM4455</h2>
                 <div class="upload-sec"> 
                 	  <div class="box1">
                      	   <div class="check-area">
                                <label class="chek-box">Vis som ny profil
                                <?php 
                                $checked_new = '';
                                if($value['marked_as_new']){
                                  $checked_new = 'checked="checked"';
                                }
                                ?>
                                       <input type="checkbox" <?php echo $checked_new; ?> class="marked_as_new">
                                       <span class="checkmark"></span>
                                </label>
                           </div>
                      </div>
                      
                      <div class="box2">
                      	   <div class="row">
                           		<div class="col3"><label>Fra:</label></div>
                                <div class="col3"><input type="text" class="form-input1 marked_as_new_from_day" placeholder="DD" maxlength=2></div>
                                <div class="col3"><input type="text" class="form-input1 marked_as_new_from_month" placeholder="MM" maxlength=2></div>
                                <div class="col3"><input type="text" class="form-input1 marked_as_new_from_year" placeholder="YYYY" maxlength=4></div>
                           </div>
                           
                           <div class="row">
                           		<div class="col3"><label>Til:</label></div>
                                <div class="col3"><input type="text" class="form-input1 marked_as_new_till_day" placeholder="DD" maxlength=2></div>
                                <div class="col3"><input type="text" class="form-input1 marked_as_new_till_month" placeholder="MM" maxlength=2></div>
                                <div class="col3"><input type="text" class="form-input1 marked_as_new_till_year" placeholder="YYYY" maxlength=4></div>
                           </div>
                      </div>
                      
                 
                 	  <a class="upload-close" href="/admin"></a>
                 </div>
            </div>
       </div><!--close page-top-->
       
       
       <div class="page-bottom">
       		<div class="container">
            	 
                 <div class="form-sec">
                 	  <div class="form-header"><h2>Profil informationer</h2></div>
                 </div><!--close form-sec-->
                 
                 <div class="form-area">
                 	    <div class="black-right">
                    	 <a href="#" class="black-edit"></a>
                    	</div>
                      
                 	  <div class="form-inner1">
                      	   <div class="row">
                           		<div class="col6">
                                	 <h3>PERSONLIG INFO</h3>
                                     <div class="form-row">
                                     	  <input type="text" class="form-input1 first_name" placeholder="Anders" value="<?php echo $value['first_name'] ;?>" >
                                     </div>
                                     
                                     <div class="form-row">
                                     	  <input type="text" class="form-input1 last_name" placeholder="Andersen"  value="<?php echo $value['last_name'] ;?>" >
                                     </div>
                                     
                                     <div class="form-row">
                                     	  <input type="password" class="form-input1 password_primary" placeholder="***********"  value="<?php echo $value['password'] ;?>" >
                                     </div>
                                     
                                     <div class="form-row">
                                     	  <input type="password" class="form-input1 password" placeholder="***********" value="<?php echo $value['password'] ;?>" >
                                     </div>
                                </div>
                                
                                <div class="col6">
                                	 <h3>ADRESSE</h3>
                                     <div class="form-row">
                                     	  <div class="row">
                                          	   <div class="col6"><input type="text" class="form-input1 zipcode" placeholder="4220"  value="<?php echo $value['zipcode'] ;?>" ></div>
                                               <div class="col6"><input type="text" class="form-input1 city" placeholder="Korsør" value="<?php echo $value['city'] ;?>" ></div>
                                          </div>
                                     </div>
                                     
                                     <div class="form-row">
                                     	  <input type="text" class="form-input1 address" placeholder="address: eg. Skovvejen 11" value="<?php echo $value['address'] ;?>" >
                                     </div>
                                     
                                     <div class="form-row">
                                     	  <?php // <input type="text" class="form-input1 country" placeholder="Country: eg. Danmark" value="$value['country_id'];" >  ?>
                                         <div class="custom-select">
                                                  <!-- country -->
                                                  <select class="country_id">
                                                    <?php   
                                                      foreach ($country_list as $key => $country) {
                                                        $selected_country = '';
                                                        if($country['id'] == $value['country_id']){
                                                          $selected_country = 'selected=selected';
                                                        }
                                                        echo "<option value='".$country['id']."' ".$selected_country.">".$country['name']."</option>";
                                                      }
                                                    ?>
                                                  </select>
                                                </div>
                                     </div>
                                     
                                </div>
                           </div>
                      </div>
                 </div><!--close form-area-->
                 
                 <div class="form-area">
                 	  <div class="form-inner1">
                      	   <div class="row">
                           		<div class="col6">
                                	 <h3>PERSONLIG INFO</h3>
                                     <div class="form-row">
                                     	  <input type="text" class="form-input1 email" placeholder="hej@hej.dk" value="<?php echo $value['email'] ;?>" >
                                     </div>
                                     
                                     <div class="form-row">
                                     	  <div class="row">
                                          	   <div class="col6"><input type="text" class="form-input1 phone" placeholder="primary phone" value="<?php echo $value['phone'] ;?>" ></div>
                                               <div class="col6"><input type="text" class="form-input1 phone_at_work" placeholder="phone at work" value="<?php echo $value['phone_at_work'] ;?>" ></div>
                                          </div>
                                     </div>
                                     
                                     <div class="form-row">
                                     	  <div class="row">
                                              <div class="col6">
                                                <?php // <input type="text" class="form-input1 gender" placeholder="Mand" value="echo $value['gender_id']" > ?>
                                                <div class="custom-select">
                                                  <!-- gender -->
                                                  <select class="gender_id">
                                                    <?php   
                                                      foreach ($gender_list as $key => $gender) {
                                                        $selected_gender = '';
                                                        if($gender['id'] == $value['gender_id']){
                                                          $selected_gender = 'selected=selected';
                                                        }
                                                        echo "<option value='".$gender['id']."' ".$selected_gender.">".$gender['name']."</option>";
                                                      }
                                                    ?>
                                                  </select>
                                                </div>
                                              </div>
                                          </div>
                                     </div>
                                </div>
                                
                                <div class="col6">
                                	 <h3>FØDT</h3>
                                     <div class="form-row">
                                     	  <div class="row">
                                          	   <div class="col4"><input type="text" class="form-input1 birth_day" placeholder="DD" value="<?php echo $value['birth_day'] ;?>" ></div>
                                               <div class="col4"><input type="text" class="form-input1 birth_month" placeholder="MM" value="<?php echo $value['birth_month'] ;?>" ></div>
                                               <div class="col4"><input type="text" class="form-input1 birth_year" placeholder="YYYY" value="<?php echo $value['birth_year'] ;?>" ></div>
                                          </div>
                                     </div>
                                     
                                     <div class="form-row">
                                     	  <input type="text" class="form-input1 ethinic_origin" placeholder="Etninsk oprindelse" value="" >
                                     </div>
                                     
                                </div>
                           </div>
                      </div>
                 </div><!--close form-area-->
                 
                 <div class="form-area">
                 	  <div class="form-inner1 form-inner2">
                      	   <div class="row">
                           		<div class="col12">
                                	 <h3>BETALING</h3>
                                     <div class="form-row">
                                     	  <div class="row payment-type-1">
                                          	   <div class="col3"><span class="percent">25 %</span></div>
                                               <div class="col6"><input type="text" class="form-input1" placeholder="Skriv her.." value="<?php echo $value['payments'][0]['description'] ;?>" ></div>
                                               <div class="col3">
                                               <?php
                                                      $checked_active = ($value['payments'][0]['applies']) ? 'checked="checked"' : '';
                                                      $checked_paid = ($value['payments'][0]['paid']) ? 'checked="checked"' : '';
                                                    ?>
                                               <div class="check-area">
                                                        <label class="chek-box">Aktiv
                                                          <input class="active" type="checkbox" <?php echo $checked_active;?>>
                                                          <span class="checkmark"></span>
                                                        </label>
                                                    </div>
                                                    
                                                    <div class="check-area">
                                                        <label class="chek-box">Betalt
                                                          <input class="paid" type="checkbox" <?php echo $checked_paid;?>>
                                                          <span class="checkmark"></span>
                                                        </label>
                                                    </div>
                                               </div>
                                          </div>
                                     </div>
                                     
                                     <div class="form-row">
                                     	  <div class="row payment-type-3">
                                          	   <div class="col3"><span class="percent">20 %</span></div>
                                               <div class="col6"><input type="text" class="form-input1" placeholder="Skriv her.." value="<?php echo $value['payments'][2]['description'] ;?>" ></div>
                                               <div class="col3">
                                               <?php
                                                      $checked_active = ($value['payments'][2]['applies']) ? 'checked="checked"' : '';
                                                      $checked_paid = ($value['payments'][2]['paid']) ? 'checked="checked"' : '';
                                                    ?>
                                               <div class="check-area">
                                                        <label class="chek-box">Aktiv
                                                          <input class="active" type="checkbox" <?php echo $checked_active;?>>
                                                          <span class="checkmark"></span>
                                                        </label>
                                                    </div>
                                                    
                                                    <div class="check-area">
                                                        <label class="chek-box">Betalt
                                                          <input class="paid" type="checkbox" <?php echo $checked_paid;?>>
                                                          <span class="checkmark"></span>
                                                        </label>
                                                    </div>
                                               </div>
                                          </div>
                                     </div>
                                     
                                     <div class="form-row">
                                     	  <div class="row payment-type-2">
                                          	   <div class="col3"><span class="percent">7 %</span></div>
                                               <div class="col6"><input type="text" class="form-input1" placeholder="Skriv her.." value="<?php echo $value['payments'][1]['description'] ;?>" ></div>
                                               <div class="col3">
                                                    <?php
                                                      $checked_active = ($value['payments'][1]['applies']) ? 'checked="checked"' : '';
                                                      $checked_paid = ($value['payments'][1]['paid']) ? 'checked="checked"' : '';
                                                    ?>
                                               	    <div class="check-area">
                                                        <label class="chek-box">Aktiv
                                                          <input class="active" type="checkbox" <?php echo $checked_active;?>>
                                                          <span class="checkmark"></span>
                                                        </label>
                                                    </div>
                                                    
                                                    <div class="check-area">
                                                        <label class="chek-box">Betalt
                                                          <input class="paid" type="checkbox" <?php echo $checked_paid;?>>
                                                          <span class="checkmark"></span>
                                                        </label>
                                                    </div>
                                               </div>
                                          </div>
                                     </div>
                                     
                                </div>
                                
                                
                           </div>
                      </div>
                 </div><!--close form-area-->
                 
                 
                 <div class="form-area">
                 	  <div class="form-inner1 form-inner3" style="margin-top:30px;">
                      	   <div class="row">
                           		
                                <div class="col3">
                                	 <div class="custom-select">
                                      <!-- shirt size / skjorte fra-->
                                      <select class="shirt_size_from">
                                        <?php
                                          for ($i=35; $i < 50; $i++) {
                                            $selected = '';
                                            if($i == $value['shirt_size_from']){
                                              $selected = 'selected=selected';
                                            }
                                            echo "<option value='".$i."' ".$selected.">".$i."''</option>";
                                          }
                                        ?>
                                      </select>
                                    </div>
                                </div>
                                
                                <div class="col3">
                                	 <div class="custom-select">
                                      <!-- shirt size / skskjorteorte til-->
                                      <select class="shirt_size_to">
                                        <?php
                                          for ($i=35; $i < 50; $i++) { 
                                            $selected = '';
                                            if($i == $value['shirt_size_to']){
                                              $selected = 'selected=selected';
                                            }
                                            echo "<option value='".$i."' ".$selected.">".$i."''</option>";
                                          }
                                        ?>
                                      </select>
                                    </div>
                                </div>
                                
                                <div class="col3">
                                	 <div class="custom-select">
                                      <!-- child size / borne fra-->
                                      <select class="child_size_from">
                                        <?php
                                          for ($i=25; $i < 175; $i++) { 
                                            $selected = '';
                                            if($i == $value['child_size_from']){
                                              $selected = 'selected=selected';
                                            }
                                            echo "<option value='".$i."' ".$selected.">".$i."''</option>";
                                          }
                                        ?>
                                      </select>
                                    </div>
                                </div>
                                
                                <div class="col3">
                                	 <div class="custom-select">
                                      <!-- child size / borne til -->
                                      <select class="child_size_to">
                                        <?php
                                          for ($i=25; $i < 175; $i++) { 
                                            $selected = '';
                                            if($i == $value['child_size_to']){
                                              $selected = 'selected=selected';
                                            }
                                            echo "<option value='".$i."' ".$selected.">".$i."''</option>";
                                          }
                                        ?>
                                      </select>
                                    </div>
                                </div>
                                
                                <div class="col3">
                                	 <div class="custom-select">
                                      <!-- pant size / bukser fra -->
                                      <select class="pants_size_from">
                                        <?php
                                          for ($i=25; $i < 50; $i++) { 
                                            $selected = '';
                                            if($i == $value['pants_size_from']){
                                              $selected = 'selected=selected';
                                            }
                                            echo "<option value='".$i."' ".$selected.">".$i."''</option>";
                                          }
                                        ?>
                                      </select>
                                    </div>
                                </div>
                                
                                <div class="col3">
                                	 <div class="custom-select">
                                      <!-- pant size / bukser til-->
                                      <select class="pants_size_to">
                                        <?php
                                          for ($i=25; $i < 50; $i++) { 
                                            $selected = '';
                                            if($i == $value['pants_size_to']){
                                              $selected = 'selected=selected';
                                            }
                                            echo "<option value='".$i."' ".$selected.">".$i."''</option>";
                                          }
                                        ?>
                                      </select>
                                    </div>
                                </div>
                                
                                <div class="col3">
                                	 <div class="custom-select">
                                      <!-- Hair color / harfarve -->
                                      <select class="hair_color_id">
                                        <?php   
                                          foreach ($hair_colors_list as $key => $color) {
                                            $selected = '';
                                            if($color['id'] == $value['hair_color_id']){
                                              $selected = 'selected=selected';
                                            }
                                            echo "<option value='".$color['id']."' ".$selected.">".$color['name']."</option>";
                                          }
                                        ?>
                                      </select>
                                    </div>
                                </div>
                                
                                <div class="col3">
                                	 <div class="custom-select">
                                      <!-- shoe size / sko fra-->
                                      <select class="shoe_size_from">
                                        <?php
                                          for ($i=15; $i < 55; $i++) { 
                                            $selected = '';
                                            if($i == $value['shoe_size_from']){
                                              $selected = 'selected=selected';
                                            }
                                            echo "<option value='".$i."' ".$selected.">".$i."''</option>";
                                          }
                                        ?>
                                      </select>
                                    </div>
                                </div>
                                
                                <div class="col3">
                                	 <div class="custom-select">
                                      <!-- shoe size / sko til-->
                                      <select class="shoe_size_to">
                                        <?php
                                          for ($i=15; $i < 55; $i++) { 
                                            $selected = '';
                                            if($i == $value['shoe_size_to']){
                                              $selected = 'selected=selected';
                                            }
                                            echo "<option value='".$i."' ".$selected.">".$i."''</option>";
                                          }
                                        ?>
                                      </select>
                                    </div>
                                </div>
                                                                
                                <div class="col3">
                                	 <div class="custom-select">
                                      <!-- eye color / ojen farve -->
                                      <select class="eye_color_id">
                                        <?php   
                                          foreach ($eye_colors_list as $key => $color) {
                                            $selected = '';
                                            if($color['id'] == $value['eye_color_id']){
                                              $selected = 'selected=selected';
                                            }
                                            echo "<option value='".$color['id']."' ".$selected.">".$color['name']."</option>";
                                          }
                                        ?>
                                      </select>
                                    </div>
                                </div>
                                
                                <div class="col3">
                                	 <div class="custom-select">
                                      <!-- suit size / jakkesæt fra -->
                                      <select class="suite_size_from">
                                        <?php
                                          for ($i=44; $i < 65; $i++) { 
                                            $selected = '';
                                            if($i == $value['suite_size_from']){
                                              $selected = 'selected=selected';
                                            }
                                            echo "<option value='".$i."' ".$selected.">".$i."''</option>";
                                          }
                                        ?>
                                      </select>
                                    </div>
                                </div>
                                
                                <div class="col3">
                                	 <div class="custom-select">
                                      <!-- suit size / jakkesæt til-->
                                      <select class="suite_size_to">
                                        <?php
                                          for ($i=44; $i < 65; $i++) { 
                                            $selected = '';
                                            if($i == $value['suite_size_to']){
                                              $selected = 'selected=selected';
                                            }
                                            echo "<option value='".$i."' ".$selected.">".$i."''</option>";
                                          }
                                        ?>
                                      </select>
                                    </div>
                                </div>
                                <div class="col3">
                                	 <div class="">
                                      <!-- height / hojde -->
                                      <input type="text" class="form-input1 height" placeholder="Højde" value="<?php echo $value['height'];?>" >
                                    </div>
                                </div>                                
                                <div class="col3">
                                	 <div class="">
                                      <!-- weight / vaegt -->
                                      <input type="text" class="form-input1 weight" placeholder="Vægt" value="<?php echo $value['weight'];?>" >
                                    </div>
                                </div>
                                <div class="col3">
                                	 <div class="">
                                      <!-- bra size / BH str-->
                                      <input type="text" class="form-input1 weight bra_size" placeholder="BH str" value="<?php echo $value['bra_size'];?>" >
                                    </div>
                                </div>
                                
                           </div>
                      </div>
                 </div><!--close form-area-->
                 
                 
                 <div class="form-area">
                 	  <div class="form-inner5">
                      	   <div class="row">
                           		
                                <div class="textarea-sec">
                                        	 <h3>LIDT OM MIG</h3>
                                             
                                             <div class="form_box">
                                             	  <textarea name="" cols="" rows="" placeholder="Skriv her..." class="textarea2 notes"><?php echo $value['notes']?></textarea>
                               					  <a href="#" class="edit2"></a>
                                                  <span class="words">72</span>
                                             </div>
                                             <h3>SPORT &amp; HOBBY</h3>
                                             <div class="form_box">
                                             	  <textarea name="" cols="" rows="" placeholder="Skriv her..." class="textarea2 sports_hobby"><?php echo $value['sports_hobby']?></textarea>
                               					  <a href="#" class="edit2"></a>
                                                  <span class="words">72</span>
                                             </div>
                                </div>
                                
                                
                                <div class="categories-sec">
                                        	<h3><strong>KATEGORI</strong> <small>/ Vælg én eller flere</small></h3>
                                        	<div class="form_box categories">
                                              <?php
                                                $input_value   =  array();
                                                foreach ($category_list as $key => $category) {
                                                  $element_class = 'button1';
                                                  $span_class    = 'plus-icon';
                                                  if(isset($value['categories']) && in_array($category['id'], $value['categories'])){
                                                    $element_class = 'button2';
                                                    $span_class    = 'close-icon';
                                                    $input_value[] = $category['id'];
                                                  }
                                                  echo '<button href="#" cid="'.$category['id'].'" class="'.$element_class.'">'.$category['name'].' <span class="'.$span_class.'"></span></button>';
                                                }
                                                $category_value = implode(',', $input_value);
                                              ?>
                                              <input type="hidden" name="selectedcategories" id="selectedcategories" value="<?php echo $category_value;?>" class="category_value">
                                          </div>
                                             
                                             <h3>ERFARING</h3>
                                             <div class="form_box skills">
                                                  <?php
                                                    $input_value    = array();
                                                    foreach ($skills_list as $key => $skill) {
                                                      $element_class = 'button1';
                                                      $span_class    = 'plus-icon';
                                                      if(isset($value['skills']) && in_array($skill['id'], $value['skills'])){
                                                        $element_class = 'button2';
                                                        $span_class    = 'close-icon';
                                                        $input_value[] = $skill['id'];
                                                      }
                                                      echo '<button href="#" cid="'.$skill['id'].'" class="'.$element_class.'">'.$skill['name'].' <span class="'.$span_class.'"></span></button>';
                                                    }
                                                    $skill_value  = implode(',', $input_value);
                                                  ?>
                                                  <input type="hidden" name="selectedskills" id="selectedskills" value="<?php echo $skill_value;?>" class="skill_value">
                                             </div>
                                             
                                             <h3>KØREKORT</h3>
                                             <div class="form_box licences">
                                                  <?php
                                                    $input_value   =  array();
                                                    foreach ($licences_list as $key => $licence) {
                                                      $element_class = 'button1';
                                                      $span_class    = 'plus-icon';
                                                      if(isset($value['licenses']) && in_array($licence['id'], $value['licenses'])){
                                                        $element_class = 'button2';
                                                        $span_class    = 'close-icon';
                                                        $input_value[] = $licence['id'];
                                                      }
                                                      echo '<button href="#" cid="'.$licence['id'].'" class="'.$element_class.'">'.$licence['name'].' <span class="'.$span_class.'"></span></button>';
                                                    }
                                                    $licence_value  = implode(',', $input_value);
                                                  ?>
                                                  <input type="hidden" name="selectedlicences" id="selectedlicences" value="<?php echo $licence_value;?>" class="licence_value">
                                             </div>
                                        </div>
                                
                                
                           </div>
                      </div>
                 </div><!--close form-area-->
                 
                 
                 <div class="form-area">
                 	  <div class="form-inner5">
                      	   <div class="row">
                           		
                                <div class="form-area1">
                                	 <h3>SPROG</h3>
                                     <div class="fields">
                                     <?php /* ?>
                                     	  <div class="form-row">
                                     	  	   <input type="text" class="form-input1" placeholder="Dansk*">
                                     	  </div>
                                          <div class="form-row">
                                          	   <div class="custom-select">
                                                  <select>
                                                    <option value="0">Sprog</option>
                                                    <option value="1">Skjorte </option>
                                                    <option value="2">Skjorte </option>
                                                    <option value="3">Skjorte </option>
                                                  </select>
                                                </div>
                                          </div>
                                          
                                          <div class="form-row">
                                          	   <div class="custom-select">
                                                  <select>
                                                    <option value="0">Sprog</option>
                                                    <option value="1">Skjorte </option>
                                                    <option value="2">Skjorte </option>
                                                    <option value="3">Skjorte </option>
                                                  </select>
                                                </div>
                                          </div>
                                          
                                          <div class="form-row">
                                          	   <div class="custom-select">
                                                  <select>
                                                    <option value="0">Sprog</option>
                                                    <option value="1">Skjorte </option>
                                                    <option value="2">Skjorte </option>
                                                    <option value="3">Skjorte </option>
                                                  </select>
                                                </div>
                                          </div>
                                          <?php */ ?>
                                          <?php
                                          $lang_html = '';
                                          for($i=0; $i < 4; $i++){
                                            $lang_html .= '<div class="form-row">
                                              <div class="custom-select">
                                                <select id="language_id_'. $i .'">
                                                  <option value="0">Sprog</option>';
                                                  foreach($language_list as $key => $lang){
                                                    $selected = '';
                                                    if(isset($value['languages'][$i]) && $lang['id'] == $value['languages'][$i]['lang_id']){
                                                      $selected = 'selected=selected';
                                                    }
                                                    $lang_html .= '<option value="'.$lang['id'].'" '.$selected.'>'.$lang['name'].' </option>';
                                                  }
                                                  $lang_html .= '</select>
                                              </div>
                                            </div>';
                                          }
                                          echo $lang_html;
                                          ?>
                                     </div>
                                </div>
                                
                                
                                <div class="form-area2">
                                	 <h3>Vælg niveau</h3>
                                              <?php
                                              $lang_rate_html = '';
                                              for($i=0; $i < 4; $i++){
                                                if(!isset($value['languages'][$i]) ){
                                                  $value['languages'][$i]['rating'] = 0;
                                                }
                                                  $lang_rate_html .= '<div class="form_box">
                                                    <span class="ratings"><input type="hidden" name="langrateval_'.$i.'" id="langrateval_'.$i.'" value="'.$value['languages'][$i]['rating'].'" class="language_rating_'.$i.'">';
                                                    for($j=1; $j<=4; $j++){
                                                      $img_src = "images/star-gray.png";
                                                      if($value['languages'][$i]['rating'] >= $j ){
                                                        $img_src = "images/star-white.png";
                                                      }
                                                      $lang_rate_html .=  '<img src="'.$img_src.'" ratevalue="'.$j.'">';
                                                    }
                                                    $lang_rate_html .=  '</span>
                                                  </div>';
                                              }
                                              echo $lang_rate_html;
                                              ?>
                                              <?php /*
                                              <div class="form_box">
                                             	  <span class="ratings">
                                                  	    <img src="images/star-white.png">
                                                        <img src="images/star-white.png">
                                                        <img src="images/star-white.png">
                                                        <img src="images/star-white.png">
                                                  </span>
                                              </div>
                                             
                                             <div class="form_box">
                                             	  <span class="ratings">
                                                  	    <img src="images/star-gray.png">
                                                        <img src="images/star-gray.png">
                                                        <img src="images/star-black.png">
                                                        <img src="images/star-black.png">
                                                  </span>
                                             </div>
                                             
                                             <div class="form_box">
                                             	  <span class="ratings">
                                                  	    <img src="images/star-gray.png">
                                                        <img src="images/star-gray.png">
                                                        <img src="images/star-gray.png">
                                                        <img src="images/star-gray.png">
                                                  </span>
                                             </div>
                                             
                                             <div class="form_box">
                                             	  <span class="ratings">
                                                  	    <img src="images/star-gray.png">
                                                        <img src="images/star-gray.png">
                                                        <img src="images/star-gray.png">
                                                        <img src="images/star-gray.png">
                                                  </span>
                                             </div>
                                             <?php */ ?>

                                </div>
                                
                                
                                <div class="form-area3">
                                	 <h3>&nbsp;</h3>
                                     <div class="form_box4">
                                             	  Begynder
                                                  <span class="ratings2">
                                                  	    <img src="images/star-white.png">
                                                        <img src="images/star-gray.png">
                                                        <img src="images/star-gray.png">
                                                        <img src="images/star-gray.png">
                                                  </span>
                                             </div>
                                             
                                             <div class="form_box4">
                                             	  Mellem
                                                  <span class="ratings2">
                                                  	    <img src="images/star-white.png">
                                                        <img src="images/star-white.png">
                                                        <img src="images/star-gray.png">
                                                        <img src="images/star-gray.png">
                                                  </span>
                                             </div>
                                             
                                             <div class="form_box4">
                                             	  Flydende
                                                  <span class="ratings2">
                                                  	    <img src="images/star-white.png">
                                                        <img src="images/star-white.png">
                                                        <img src="images/star-white.png">
                                                        <img src="images/star-gray.png">
                                                  </span>
                                             </div>
                                             
                                             <div class="form_box4">
                                             	  Perfekt
                                                  <span class="ratings2">
                                                  	    <img src="images/star-white.png">
                                                        <img src="images/star-white.png">
                                                        <img src="images/star-white.png">
                                                        <img src="images/star-white.png">
                                                  </span>
                                             </div>
                                             
                                             <h3 style="margin-top:30px;">Dealekter</h3>
                                             <div class="form_box">
                                             	  <input name="dealekter1" type="text" class="form-input1 dealekter1" placeholder="Skriv her" value="<?php echo $value['dealekter1']?>">
                                             </div>
                                             
                                             <div class="form_box">
                                             	  <input name="dealekter2" type="text" class="form-input1 dealekter2" placeholder="Skriv her" value="<?php echo $value['dealekter2']?>">
                                             </div>
                                             
                                             <div class="form_box">
                                             	  <input name="dealekter3" type="text" class="form-input1 dealekter3" placeholder="Skriv her" value="<?php echo $value['dealekter3']?>">
                                             </div>
                                </div>
                                
                           </div>
                      </div>
                 </div><!--close form-area-->
                 
                 <div class="button-area">
                 	<a class="btn_1 cancel_update" href="/admin">Afvis</a>
                  <a class="btn_2 submit_update" href="#">Godkend</a>
                  <textarea style="display:none" class="loaded_profile_info"><?php echo $json_profile_info;?></textarea>
                 </div>
                 
                 <div class="toolbar-bottom">
                      <div class="tool-left">
                           <a class="back-btn" href="/admin">Tilbage</a>
                      </div>
                      <div class="tool-right">
                      		<ul>
                            	<li><a href="#">Castingsheet</a></li>
                                <li><a href="#">KALENDER</a></li>
                                <li><a class="media_page_link" href="/admin/profilemedia?id=<?php echo $id; ?>&type=all">FOTO/VIDEO</a></li>
                            </ul>
                      </div>
                 </div>
            </div>
       </div><!--close page-bottom-->
	  
  </div><!--close content-->
 
</div><!--close wrapper--> 

<script src="js/jquery-3.3.1.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/scripts.js"></script>
<script src="js/jquery.simplePopup.js" type="text/javascript"></script>
<script type="text/javascript">

$(document).ready(function(){

    $('.show1').click(function(){
	$('#pop1').simplePopup();
    });
    
});

</script>

<script src="js/bootstrap-toggle.js"></script>
<script>
var x, i, j, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
for (i = 0; i < x.length; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 0; j < selElmnt.length; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        h = this.parentNode.previousSibling;
        for (i = 0; i < s.length; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            for (k = 0; k < y.length; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);
</script>

</body>
</html>