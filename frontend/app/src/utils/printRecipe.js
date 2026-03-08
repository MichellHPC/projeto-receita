export const printRecipe = (recipe) => {
  const printWindow = window.open('', '_blank', 'width=700,height=700');

  if (!printWindow) {
    return false;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Receita - ${recipe.nome}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          h1 { margin-bottom: 8px; }
          p { margin: 8px 0; }
          .content { white-space: pre-wrap; margin-top: 12px; }
        </style>
      </head>
      <body>
        <h1>${recipe.nome}</h1>
        <p><strong>ID:</strong> ${recipe.id}</p>
        <div class="content">${recipe.texto}</div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  return true;
};
