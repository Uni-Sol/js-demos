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
    s=0; 
  }

  public void draw() {
    //System.out.println("s is "+ (s&w) +"\n");
    //System.out.println("mouseY is "+ mouseY +"\n");
    //System.out.println("mY/w is "+(mouseY/(w*0.5)) +"\n");
    for(y=0;y<w;y++){ 
      for(x=0;x<w;x++){  
        set( x, y, color((s+uPv[y*w+x])&0xFF) ); 
        set( x+w, y, color((u2lv[y*w+x])&0xFF) );
        set( x+w2, y, color(((s+uPv[y*w+x])^(int)((1.0-mouseY/(w*0.5)) * u2lv[y*w+x]))&0xFF) );
        //set(x+w2,y,color(t[((s&w)*w*w)+(y*w)+x])); 
      }  
    }
    s++;
    if (spress) s = 0;
    if (s == 127) {
      save("Tunnel.s127.png");
    }
  }

  public void mousePressed() {
    spress = true;
  }

  public void mouseReleased() {
    spress = false;
  }
  
