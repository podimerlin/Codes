<?php

namespace Application\Helper;

class AppConfig 
{
    const APP_TIMEZONE = '+7';
    
    const USER_GENDER_MALE = 1;
    const USER_GENDER_FEMALE = 0;
    
    const USER_AVATAR_FOLDER = './public/uploads/avatar';
    const USER_AVATAR_FOLDER_PREG = '/.\/public\/uploads\/avatar(\\\|\\/)/i';
    
    const USER_DEFAULT_ITEMS_PER_PAGE = 3;
    
    const USER_DEFAULT_LATITUDE = 1.3520865;
    const USER_DEFAULT_LONGITUDE = 103.8599104;
    
}