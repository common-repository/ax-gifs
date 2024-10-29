<?php
/*
 Plugin Name: AX Gifs
 Description: Adds functionality to search Giphy for gifs and add them to the content editor in an accessible way with optional extra alt tag.
 Version: 1.1
 Author: Clear Honest Design
 Author URI: https://clearhonestdesign.com
 Plugin URI: https://bighack.org
 */

 class axgifTinyMCE {

     /**
     * Constructor. Called when the plugin is initialised.
     */
     function __construct() {

     }

 }

 $axgifTinyMCE = new axgifTinyMCE;

if(is_admin()) {
  add_action( 'init', 'setupAXGifButtons' );
  // if ( ! current_user_can( 'edit_posts' ) && ! current_user_can( 'edit_pages' ) ) {
  //             return;
  // }
  //
  // if ( get_user_option( 'rich_editing' ) !== 'true' ) {
  // return;
  // }

  function setupAXGifButtons() {
      add_filter( "mce_external_plugins", "axgif_add_buttons" );
      add_filter( 'mce_buttons', 'axgif_register_buttons' );
  }

  // Update CSS within in Admin
  function admin_style() {
    wp_enqueue_style('admin-styles', plugins_url('admin.css', __FILE__));
  }
  add_action('admin_enqueue_scripts', 'admin_style');

  add_filter( 'tiny_mce_before_init', function($mce_init) {
  $content_css =  plugins_url('admin.css', __FILE__);

  if (isset($mce_init[ 'content_css' ])) {
    $mce_init[ 'content_css' ] = "{$mce_init['content_css']},{$content_css}";
  }

  return $mce_init;
});


   function axgif_add_buttons( $plugin_array ) {
       $plugin_array['axgifbuttons'] = plugins_url('axgif-plugin.js', __FILE__);
       return $plugin_array;
   }
   function axgif_register_buttons( $buttons ) {
       array_push( $buttons, 'gif');
       return $buttons;
   }

} else {

add_action('wp_enqueue_scripts', 'axgif_styles');
function axgif_styles() {
  if ( ! wp_script_is( 'jquery', 'enqueued' )) {
      wp_enqueue_script( 'jquery' );
  }
    wp_register_style( 'axgif-style', plugins_url('axgif-style.css', __FILE__ ) );
    wp_enqueue_style( 'axgif-style' );
    wp_register_script( 'axgif-script', plugins_url('axgif-script.js', __FILE__ ) );
    wp_enqueue_script( 'axgif-script' );
}

} ?>
