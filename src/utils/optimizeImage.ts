type ImageFormat = "jpeg" | "png" | "webp" | "bmp" | "ico" | "tiff";

type Options = {
	returnType: "blob" | "base64";
	quality?: number;
	format?: ImageFormat;
};

type ReturnType<Opts extends Options> = Opts["returnType"] extends "blob"
	? Blob
	: string;

export const optimizeImage = async <Opts extends Options>(
	image: File,
	options: Opts
): Promise<ReturnType<Opts>> => {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
	const quality = options.quality ?? 0.9;

	const format = options.format ?? (image.type.split("/")[1] as ImageFormat);
	const mimetype = `image/${format}`;

	const bitmap = await createImageBitmap(image);
	canvas.width = bitmap.width;
	canvas.height = bitmap.height;

	ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

	if (options.returnType === "blob") {
		return new Promise<Blob>((resolve, reject) => {
			canvas.toBlob(
				(blob) => {
					if (blob) {
						resolve(blob);
					} else {
						reject();
					}
				},
				mimetype,
				quality
			);
			// have no clue why TypeScript is yelling here
			// Type 'Blob' is not assignable to type 'ReturnType'
		}) as any;
	}

	// have no clue why TypeScript is yelling here
	// Type 'string' is not assignable to type 'ReturnType'
	return canvas.toDataURL(mimetype, quality) as any;
};
