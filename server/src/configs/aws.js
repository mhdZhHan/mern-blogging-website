import aws from "aws-sdk"

const accessKeyId = process.env.AWS_ACCESS_KEY

const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new aws.S3({
    region: "ap-south-1",
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
})

export { s3 }
