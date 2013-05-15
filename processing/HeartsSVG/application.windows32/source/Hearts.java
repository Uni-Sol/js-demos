import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import org.philhosoft.p8g.svg.P8gGraphicsSVG; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class Hearts extends PApplet {



/*
Simple test, exercing B\u00e9zier curves and simple geometry
(fill, stroke...).
*/

Heart h1, h2, h3, h4;

public void setup()
{
  // Renders only on the SVG surface, no display
  size(400, 400, P8gGraphicsSVG.SVG, "Hearts.svg");
  smooth();
  background(0xff88AAFF);

  h1 = new Heart(70, 150, 50, 2.0f, 1.0f, 1.0f, 0.0f, 2, 0xffFF0000, 0xffFFA0A0);
  h2 = new Heart(200, 50, 50, 1.2f, 0.8f, 0.5f, 60.0f, 8, 0xff550000, 0xff882020);
  h3 = new Heart(250, 220, 100, 0xff800000, 0xffAA5555);
  h4 = new Heart(50, 320, 50, 1.5f, 0.7f, 0.5f, 30.0f, 7, 0xffFFFF00, 0xff00FFAA);
}

public void draw()
{
  fill(0xffEEEEAA);
  stroke(0xffFFFFCC);
  strokeWeight(20);
  ellipse(width / 2, height / 2, width * 0.75f, height * 0.75f);

  h1.draw();
  h2.draw();
  h3.draw();
  // Shows that Java2D (and SVG) also scales the stroke!
  scale(4, 1);
  h4.draw();

  println("Done");
  // Mandatory, so that proper cleanup is called, saving the file
  exit();
}
class Heart
{
  // Lazy (Processing) class: leave direct access to parameters... Avoids having lot of setters.
  float m_x, m_y;	// Position of heart, the coordinates of the top
  int m_lineWidth;
  int m_colorLine;
  int m_colorFill;
  float m_size;	// Half width, the other factors are relative to this measure
  float m_proportion;	// Kind of ratio between half-width and distance between both sharp points
  float m_topFactor;	// Relative size of top vector (control handle)
  float m_bottomFactor;	// Relative size of vector of bottom point
  float m_bottomAngle;	// Angle of bottom vector, in degrees, relative to vertical axis

  private float m_topVectorLen;
  private float m_bottomLen;
  private float m_bottomVector_dx, m_bottomVector_dy;

  /**
   * Simple constructor with hopefully sensible defaults.
   */
  Heart(float x, float y, float size, int colorLine, int colorFill)
  {
    this(x, y, size, 1.5f, 0.7f, 0.5f, 30.0f, 1, colorLine, colorFill);
  }

  /**
   * Full constructor.
   */
  Heart(float x, float y, float size, float proportion,
      float topFactor, float bottomFactor, float bottomAngle,
      int lineWidth, int colorLine, int colorFill
  )
  {
    m_x = x; m_y = y;
    m_size = size;
    m_proportion = proportion;
    m_lineWidth = lineWidth;
    m_colorLine = colorLine;
    m_colorFill = colorFill;
    m_topFactor = topFactor;
    m_bottomFactor = bottomFactor;
    m_bottomAngle = bottomAngle;

    update();
  }

  /**
   * After setting parameters, must call this method.
   */
  public void update()
  {
    m_topVectorLen = m_size * m_topFactor;
    m_bottomLen = m_size * m_proportion;
    float bottomAngle = (90 - m_bottomAngle) * PI / 180.0f;
    float bottomVectorLength = m_size * m_bottomFactor;
    m_bottomVector_dx = cos(bottomAngle) * bottomVectorLength;
    m_bottomVector_dy = sin(bottomAngle) * bottomVectorLength;
  }

  public void draw()
  {
    fill(m_colorFill);
    stroke(m_colorLine);
    strokeWeight(m_lineWidth);

    beginShape();
    // The heart, symmetrical around vertical axis
    // Anchor point (highest sharp point)
    vertex(m_x, m_y);
    // Top left part
    bezierVertex(
        m_x, m_y - m_topVectorLen,	// Upward control vector
        m_x - m_size, m_y - m_topVectorLen,	// Idem
        m_x - m_size, m_y);
    // Bottom left part
    bezierVertex(
        m_x - m_size, m_y + m_topVectorLen,	// Downward control vector
        m_x - m_bottomVector_dx, m_y + m_bottomLen - m_bottomVector_dy,
        m_x, m_y + m_bottomLen);
    // Bottom right part
    bezierVertex(
        m_x + m_bottomVector_dx, m_y + m_bottomLen - m_bottomVector_dy,
        m_x + m_size, m_y + m_topVectorLen,	// Downward control vector
        m_x + m_size, m_y);
    // Top right part
    bezierVertex(
        m_x + m_size, m_y - m_topVectorLen,	// Upward control vector
        m_x, m_y - m_topVectorLen,	// Idem
        m_x, m_y);

    endShape();
  }
}
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "Hearts" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
