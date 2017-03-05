<?php

namespace ZfcUser\Entity;

interface UserInterface
{
    public function getId();

    public function getUsername();

    public function getEmail();

    public function getDisplayName();

    public function getPassword();

    public function getState();

    public function getAvatar();

    public function getGender();

    public function getMobilephone();

    public function getDescription();

    public function getDateAdded();

    public function getDateModified();

    public function setId($id);

    public function setUsername($username);

    public function setEmail($email);

    public function setDisplayName($displayName);

    public function setPassword($password);

    public function setState($state);

    public function setAvatar($avatar);

    public function setGender($gender);

    public function setMobilephone($mobilephone);

    public function setDescription($description);

    public function setDateAdded($dateAdded);

    public function setDateModified($dateModified);
    
    public function getHashtag();
    
    public function setHashtag($hashtag);
    
    public function getLatitude();
    
    public function getLongitude();
    
    public function setLatitude($latitude);
    
    public function setLongitude($longitude);
}
