import axios from "axios";

export async function POST(request: Request) {
  try {
    const usuario = await request.json();
    await axios.post('https://script.google.com/macros/s/AKfycbyfx6_7xogeoehBVDMRn1EHovqXlKLij8jwM3GIlbXXN-Vjwek1kfU9RfYr89tcrvKNUg/exec', {
      ...usuario
    });

    return new Response(JSON.stringify({ message: 'Venda adicionada com sucesso!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Erro ao adicionar usuário:', error.message);
    return new Response(JSON.stringify({
      error: 'Erro ao adicionar usuário',
      message: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function GET() {
  try {
    const response = await axios.get('https://script.google.com/macros/s/AKfycbyfx6_7xogeoehBVDMRn1EHovqXlKLij8jwM3GIlbXXN-Vjwek1kfU9RfYr89tcrvKNUg/exec');
    
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Erro ao obter dados:', error.message);
    return new Response(JSON.stringify({
      error: 'Erro ao obter dados',
      message: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await axios.post('https://script.google.com/macros/s/AKfycbyfx6_7xogeoehBVDMRn1EHovqXlKLij8jwM3GIlbXXN-Vjwek1kfU9RfYr89tcrvKNUg/exec', {
      id,
      method: 'delete'
    });

    return new Response(JSON.stringify({ message: 'Venda deletada com sucesso!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Erro ao deletar usuário:', error.message);
    return new Response(JSON.stringify({
      error: 'Erro ao deletar usuário',
      message: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...novosDados } = await request.json();
    await axios.post('https://script.google.com/macros/s/AKfycbyfx6_7xogeoehBVDMRn1EHovqXlKLij8jwM3GIlbXXN-Vjwek1kfU9RfYr89tcrvKNUg/exec', {
      id,
      ...novosDados,
      method: 'put'
    });

    return new Response(JSON.stringify({ message: 'Venda atualizada com sucesso!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error.message);
    return new Response(JSON.stringify({
      error: 'Erro ao atualizar usuário',
      message: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
