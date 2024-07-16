import axios from "axios";

export async function POST(request: Request) {
  try {
    const contaPagar = await request.json();
    await axios.post('https://script.google.com/macros/s/AKfycbzMm-uS3TneeY96VGm118MXwHOdotM67wUorPrSesJlEYn9ttCIwJWD6k8zdaHa0pyGgQ/exec', {
        ...contaPagar
      });

    return new Response(JSON.stringify({ message: 'Conta a pagar adicionada com sucesso!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Erro ao adicionar conta a pagar:', error.message);
    return new Response(JSON.stringify({
      error: 'Erro ao adicionar conta a pagar',
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
    const response = await axios.get('https://script.google.com/macros/s/AKfycbzMm-uS3TneeY96VGm118MXwHOdotM67wUorPrSesJlEYn9ttCIwJWD6k8zdaHa0pyGgQ/exec');
    
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
    await axios.post('https://script.google.com/macros/s/AKfycbzMm-uS3TneeY96VGm118MXwHOdotM67wUorPrSesJlEYn9ttCIwJWD6k8zdaHa0pyGgQ/exec', {
        id,
        method: 'delete'
      });

    return new Response(JSON.stringify({ message: 'Conta a pagar deletada com sucesso!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Erro ao deletar conta a pagar:', error.message);
    return new Response(JSON.stringify({
      error: 'Erro ao deletar conta a pagar',
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
    const contaPagar = await request.json();
    await axios.post('https://script.google.com/macros/s/AKfycbzMm-uS3TneeY96VGm118MXwHOdotM67wUorPrSesJlEYn9ttCIwJWD6k8zdaHa0pyGgQ/exec', {
        ...contaPagar,
        method: 'put'
      });

    return new Response(JSON.stringify({ message: 'Conta a pagar atualizada com sucesso!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Erro ao atualizar conta a pagar:', error.message);
    return new Response(JSON.stringify({
      error: 'Erro ao atualizar conta a pagar',
      message: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
