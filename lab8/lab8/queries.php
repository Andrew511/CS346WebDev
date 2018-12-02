<?php

  /* insert a new question into the database
     return true or output an error message, disconnect, and exit
   */
  function insert_question($id, $desc, $points) {
    global $db;

    try {
      $query = "INSERT INTO Questions VALUES (?,?,?)";
      $stmt = $db->prepare($query);
      $stmt->execute([$id, $desc, $points]);
      return true;
    } catch (PDOException $e) {
        db_disconnect();
        exit("Aborting: There was a database error when inserting " .
              "a new question.");
    }
  }

  /*  return a PDOstatement's result set containing the question with the
      given ID (this will be an empty result set, with no error, if there is no
      question with the given ID in the database)
      output an error message, disconnect, and exit in case something goes
      wrong
   */
  function retrieve_question($id) {
    global $db;
    
      try {
        $query = "SELECT * FROM Questions
                  WHERE ID = :id";
        $stmt = $db->prepare($query);
        $stmt->execute(["id" => $id]);
        return  $stmt->fetch(PDO::FETCH_ASSOC);
      } catch (PDOException $e) {
          db_disconnect();
          exit("Aborting: There was a database error when retrieving " .
               " the question.");
      }
  }

?>
