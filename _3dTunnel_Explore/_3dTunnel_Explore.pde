/* 3d tunnel vars */ 
int w=255,w2=w*2,x,y,q,r,s,c; 
int u[],v[],uPv[],u2lv[],t[]; 
void setup() { 
  size(w*3,w); 
  noStroke(); 
  c=0; 
  u=new int[w*w]; 
  v=new int[w*w]; 
  uPv=new int[w*w]; 
  u2lv=new int[w*w]; 
  t=new int[(w+1)*w*w]; 
  for(y=0;y<w;q=y++-w/2){ 
    for(x=0;x<w;r=x++-w/2){
      v[y*w+x]=int(w*atan2(q,r)/PI); 
      u[y*w+x]=int(w*32/sqrt(r*r+q*q)); 
      uPv[y*w+x]=u[y*w+x]+v[y*w+x]; 
      u2lv[y*w+x]=u[y*w+x]*2-v[y*w+x];
    }
  } 
  for(s=0;s<(w+1);s++){ 
    for(y=0;y<w;y++){ 
      for(x=0;x<w;x++){ 
        t[(s*w*w)+(y*w)+x]=((s+uPv[y*w+x])^u2lv[y*w+x])&w;
      }
    }
  }
  s=0; 
}

void draw() {
  print("s is "+ (s&w) +"\n");
  for(y=0;y<w;y++){ 
    for(x=0;x<w;x++){  
      set(x,y,color((s+uPv[y*w+x])&w)); 
      set(x+w,y,color((u2lv[y*w+x])&w));
      set(x+w2,y,color(t[((s&w)*w*w)+(y*w)+x])); 
    }  
  } 
  s++; 
  if (s == 127) {
    save("Tunnel.s127.png");
  }
}
