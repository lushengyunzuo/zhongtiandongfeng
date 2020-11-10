<?php

if(!defined('APP_KEY')) { exit('Access Denied'); }

class Helper_Img implements Suco_Helper_Interface
{
  protected $src;

  public static function callback($args)
  {
    return new self($args[0], $args[1]);
  }

  public function __construct($src, $size = null)
  {
    if (!$src) { return './img/nopic.png';  }

    $rewrite = M('Setting')->get('rewrite_enabled');

    $pos = strlen($str) - strrpos($src, '.') * -1;

    $ext = substr($src, $pos);
    $imgSrc = substr($src, 0, strlen($str)+$pos).'_'.$size.$ext;

    if ($rewrite) {
      $this->_src = $imgSrc;
    } else {
      $this->_src = '/misc.php?act=image&url='.urlencode($imgSrc);
    }
  }

  public function __toString()
  {
    return (string)new Suco_Helper_BaseUrl($this->_src);
  }
}