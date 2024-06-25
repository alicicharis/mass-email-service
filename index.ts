import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

exports.handler = async (event: any) => {
  try {
    const fileKey = event.Records[0].s3.object.key;
    const bucketName = event.Records[0].s3.bucket.name;

    const s3 = new S3Client();
    const ses = new SESClient();

    const res = await s3.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      })
    );

    const data = await res.Body?.transformToString("utf-8");

    const emails = data?.split(",");
    if (emails) {
      const res = await ses.send(
        new SendEmailCommand({
          Destination: {
            ToAddresses: emails,
          },
          Message: {
            Body: {
              Text: {
                Charset: "UTF-8",
                Data: "Hello, World!",
              },
            },
            Subject: {
              Charset: "UTF-8",
              Data: "Test email",
            },
          },
          Source: "source@gmail.com",
        })
      );
    }
  } catch (err) {
    console.error(err);
  }
};
