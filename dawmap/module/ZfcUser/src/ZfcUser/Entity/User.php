<?php

namespace ZfcUser\Entity;

class User implements UserInterface
{
    protected $id;
    protected $username;
    protected $email;
    protected $displayName;
    protected $password;
    protected $state; 
	protected $avatar;
	protected $gender;
    protected $mobilephone;
    protected $latitude;
    protected $longitude;
  	protected $description;
  	protected $hashtag;
    protected $dateAdded;    
    protected $dateModified;
    
    public function getHashtag()
    {
        return $this->hashtag;
    }

    public function setHashtag($hashtag)
    {
        $this->hashtag = $hashtag;
    }

    public function getLatitude()
    {
        return $this->latitude;
    }

    public function getLongitude()
    {
        return $this->longitude;
    }

    public function setLatitude($latitude)
    {
        $this->latitude = $latitude;
    }

    public function setLongitude($longitude)
    {
        $this->longitude = $longitude;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function getDisplayName()
    {
        return $this->displayName;
    }

    public function getPassword()
    {
        return $this->password;
    }

    public function getState()
    {
        return $this->state;
    }

    public function getAvatar()
    {
        return $this->avatar;
    }

    public function getGender()
    {
        return $this->gender;
    }

    public function getMobilephone()
    {
        return $this->mobilephone;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function getDateAdded()
    {
        return $this->dateAdded;
    }

    public function getDateModified()
    {
        return $this->dateModified;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function setUsername($username)
    {
        $this->username = $username;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function setDisplayName($displayName)
    {
        $this->displayName = $displayName;
    }

    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function setState($state)
    {
        $this->state = $state;
    }

    public function setAvatar($avatar)
    {
        $this->avatar = $avatar;
    }

    public function setGender($gender)
    {
        $this->gender = $gender;
    }

    public function setMobilephone($mobilephone)
    {
        $this->mobilephone = $mobilephone;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function setDateAdded($dateAdded)
    {
        $this->dateAdded = $dateAdded;
    }

    public function setDateModified($dateModified)
    {
        $this->dateModified = $dateModified;
    }
}
