import processing.core.*;

public class tunnel3d extends PApplet {

  /* 3d tunnel vars */ 
  static int w=255,w2=w*2,x,y,q,r,s,c,u,v; 
  static int uPv[],u2lv[],t[];
  static boolean spress=false;
  
  public void setup() { 
    size(w*3,w);
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
    if(! spress ) background(100,127,100);
    
    int fct = 31;  /* Scale factor; smaller number == bigger rows; 
                     * must be less than 255 */
    int ofs = 64;  /* Start point; must be less than 255-fct */
    strokeWeight(1);
    for(y=ofs;y<(fct+ofs);y++){
      noStroke();      
      for(x=1;x<w;x++){
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
        stroke(100,127,100);
        line( 0, (y-ofs)*(w/fct)-1, w*3, (y-ofs)*(w/fct)-1 );
      }
    }
    if( spress ) {
       s++;
       println(s);
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
