export const containsTargetURL = (url) => {
    const target = "webbytemplate-store-com.s3.ap-south-1.amazonaws.com";
    return url.includes(target);
}
