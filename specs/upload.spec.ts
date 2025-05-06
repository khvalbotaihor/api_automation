import controller from '../controller/upload.controller'

describe('Upload single file', () => {
    it('POST /upload/single', async () => {
        const response = await controller.postUploadSingleFile('data/test.png');
        console.log('response' ,response.body);
        expect(response.body).toEqual(
            expect.objectContaining({
             mimetype: 'image/png',
            filename: 'test.png'
            })
        );}
    );

    it('POST /upload/multiple', async () => {
        const response = await controller.postUploadMultipleFile(['data/test.png', 'data/test_2.png']);
        console.log('response POST /upload/multiple', response.body);
       
          expect(response.body).toEqual(
  expect.arrayContaining([
    expect.objectContaining({
      filename: 'test.png',
      mimetype: 'image/png'
    }),
    expect.objectContaining({
      filename: 'test_2.png',
      mimetype: 'image/png'
    })
  ])
);

    });

})