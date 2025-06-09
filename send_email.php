<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $fullName = htmlspecialchars($_POST['fullName']);
    $email = htmlspecialchars($_POST['email']);
    $phone = htmlspecialchars($_POST['phone']);
    $position = htmlspecialchars($_POST['position']);
    $coverLetter = htmlspecialchars($_POST['coverLetter']);

    // Handle file upload
    $resumeName = $_FILES['resume']['name'];
    $resumeTmpName = $_FILES['resume']['tmp_name'];
    $resumeSize = $_FILES['resume']['size'];
    $resumeType = $_FILES['resume']['type'];

    // Email details
    $to = "info@quantumpulse.ltd";
    $subject = "New Job Application: $position";
    $message = "You have received a new job application.\n\n";
    $message .= "Full Name: $fullName\n";
    $message .= "Email: $email\n";
    $message .= "Phone: $phone\n";
    $message .= "Position: $position\n";
    $message .= "Cover Letter:\n$coverLetter\n";

    // Attach resume
    $file = fopen($resumeTmpName, 'rb');
    $fileData = fread($file, $resumeSize);
    fclose($file);

    $boundary = md5(time());
    $headers = "From: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    // Email body
    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $body .= $message . "\r\n";

    // Attach file
    $body .= "--$boundary\r\n";
    $body .= "Content-Type: $resumeType; name=\"$resumeName\"\r\n";
    $body .= "Content-Disposition: attachment; filename=\"$resumeName\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($fileData)) . "\r\n";
    $body .= "--$boundary--";

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo "Thank you for applying! We will review your application and get back to you soon.";
    } else {
        echo "Oops! Something went wrong. Please try again later.";
    }
} else {
    echo "Invalid request method.";
}
?>