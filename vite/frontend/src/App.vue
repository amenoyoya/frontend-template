<template>
  <div class="flex flex-column lg:w-5/6 sm:w-full mx-auto my-4 justify-center">
    <textarea id="tinymce"></textarea>
  </div>
</template>

<script>
export default {
  mounted() {
    tinymce.init({
      selector: '#tinymce',
      plugins: "textcolor table lists link image code template",
      menubar: "false",
      toolbar: ['undo redo | bold italic | styleselect | forecolor backcolor | fontsizeselect',
                'numlist bullist | table | link | image | template | code'],
      fontsize_formats: '10px 12px 14px 16px 18px 20px 24px 34px',
      automatic_upload: true,
      images_upload_url: 'http://localhost:3333/api/upload/',
      images_reuse_filename: true,
      templates: [
        {title: 'Button', description: 'Insert button tag', content: '<button>Button</button>'}
      ]
    })
  }
}
</script>