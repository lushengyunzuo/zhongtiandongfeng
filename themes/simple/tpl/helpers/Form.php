<?php

if(!defined('APP_KEY')) { exit('Access Denied'); }

class Helper_Form extends Suco_Helper_Form implements Suco_Helper_Interface
{
  protected $_formGroupDom = '<div class="form-group">%s</div>';
  protected $_labelDom = '<label class="control-label" for="%s">%s</label>';
  //protected $_inputGroupDom = '<div class="input-group">%s</div>';


  public static function callback($args)
  {
    return @new self($args[0], $args[1]);
  }

  public function image($name, $value='', $label='', $attr = array())
  {
    $limit = $attr['limit'] ? $attr['limit'] : 1;
    $html = $this->label($label, $name, $attr)
      .'<div class="sui-img-selector form-control" data-plugin="img-selector" data-limit="'.$limit.'"
        data-ipt="'.$name.'" data-ref="'.$name.'">
          <div class="sui-img-value">'.$value.'</div>
          <div class="sui-img-selector-box"></div>
          <div class="sui-img-selector-btns">
          <button type="button" class="btn" role="btn">选择图片</button>
        </div>
      </div>';

    if ($attr['help-block']) {
      $html.='<span class="help-block">'.$attr['help-block'].'</span>';
    }

    return $html;
  }

  public function date($name, $value='', $label='', $attr = array())
  {
    $attr['data-plugin'] = 'date-picker';
    $html = $this->label($label, $name, $attr)
      .'<div class="input-group">'
      .$this->input($name, $value, '', $attr)
      .'<span class="input-group-addon"><i class="fa fa-calendar"></i></span>'
      .'</div>';

    return $html;
  }

  public function richtext($name, $value='', $label='', $attr = array())
  {
    $attr['data-plugin'] = 'editor';
    return $this->textarea($name, $value, $label, $attr);
  }
}