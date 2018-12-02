<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Lab 6</title>
    <link rel="stylesheet" type="text/css" href="lab6.css" />
    <script type="text/javascript" src="lab6.js"></script>
  </head>
  <body>
    <?php $N = 4; ?>
    <h1>Sliding-tile puzzle with
        <code>N = <span id="N"><?php echo $N ?></span></code>
    </h1>
    <div id="board">
      <?php
        for($i=1; $i<=$N*$N-1; $i++) {
          echo "<div id=\"$i\" class=\"tile\">$i</div>\n";
        }
      ?>
    </div>
    <div>
      <button id="shuffle">Shuffle</button>
      <button id="reset">Reset</button>
    </div>
  </body>
</html>
