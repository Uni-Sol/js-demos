import processing.core.*;
import org.philhosoft.p8g.svg.*;

public class tunnel3d extends PApplet {

  static P8gGraphicsSVG svg;

  /* 3d tunnel vars */ 
  static int w=255,w2=w*2,x,y,q,r,s,c,u,v; 
  static int uPv[],u2lv[],t[];
  static boolean spress=false;
  
  public void setup() { 
    size(w*3,w);
    svg = (P8gGraphicsSVG) createGraphics(width, height, P8gGraphicsSVG.SVG, "tunnel3d.svg");
    //noLoop();
    noStroke(); 
    c=0;
    uPv=new int[w*w]; 
    u2lv=new int[w*w]; 
    t=new int[(w+1)*w*w]; 
    for(y=0;y<w;q=y++-w/2){ 
      for(x=0;x<w;r=x++-w/2){
        v=(int)(w*atan2(q,r)/PI); 
        u=(int)(w*32/sqrt(r*r+q*q)); 
        uPv[y*w+x]=u+v; 
        u2lv[y*w+x]=u*2-v;
      }
    } 
    for(s=0;s<(w+1);s++){ 
      for(y=0;y<w;y++){ 
        for(x=0;x<w;x++){ 
          //t[(s*w*w)+(y*w)+x]=((s+uPv[y*w+x])^u2lv[y*w+x])&w;
        }
      }
    }
    s=1; 
  }

  public void draw() {
    if( s == 0 ) beginRecord(svg);
    

    //System.out.println("s is "+ (s&w) +"\n");
    //System.out.println("mouseY is "+ mouseY +"\n");
    //System.out.println("mY/w is "+(mouseY/(w*0.5)) +"\n");
    int fct = 250; // Scale factor; smaller number == bigger rows; must be less than 255
    int ofs = 4; // Start point; must be less than 255-fct
    strokeWeight(1);
    for(y=ofs;y<(fct+ofs);y++){
      noStroke();      
      for(x=0;x<w;x++){
        if(! spress ) {
          fill( color((s+uPv[y*w+x])&0xFF, 0, 0) );
          rect( x, (y-ofs)*(w/fct), 2, w/fct ); 
          fill( color(0, 0, (u2lv[y*w+x])&0xFF) );
          rect( x+w, (y-ofs)*(w/fct), 2, w/fct );
        }
        //fill( color((s+uPv[y*w+x])&0xFF, 0, (u2lv[y*w+x])&0xFF) );
        //rect( x+w2, (y-ofs)*(w/fct), 2, w/fct );
        set( x+w2, (y-ofs)*(w/fct), color((s+uPv[y*w+x])&0xFF, 0, (u2lv[y*w+x])&0xFF) );
      } 
      if( fct < 64 ) {
        stroke(255);
        line( 0, (y-ofs)*(w/fct), w*3, (y-ofs)*(w/fct) );
      }
    }
    if( spress ) {
       s++;
       println(s);
    }
    if( s == 0 ) {
       println( s );
       endRecord();
       println( "Done drawing\n" );
    }
    if( s == 64 ) {
      save("Tunnel.s64.png");
    }
  }

  public void mousePressed() {
    spress = true;
  }

  public void mouseReleased() {
    spress = false;
  }
}
