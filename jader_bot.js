const { Client, LocalAuth, MessageMedia, Buttons, List } = require('whatsapp-web.js');
const express = require('express');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(fileUpload({
  debug: true
}));
app.use("/", express.static(__dirname + "/"))

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'bot-zdg-server' }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ]
  }
});

client.initialize();

io.on('connection', function (socket) {
  socket.emit('message', 'JaderBot - Iniciado');
  socket.emit('qr', './img/aguardando.jpg');

  client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit('qr', url);
      socket.emit('message', 'QRCode recebido, aponte a câmera seu celular!');
    });
  });

  client.on('ready', () => {
    socket.emit('ready', 'JaderBot - Dispositivo pronto!');
    socket.emit('message', 'JaderBot - Dispositivo pronto!');
    socket.emit('qr', './img/wpp.svg')
    console.log('JaderBot - Dispositivo pronto');
  });

  client.on('authenticated', () => {
    socket.emit('authenticated', 'JaderBot - Autenticado!');
    socket.emit('message', 'JaderBot - Autenticado!');
    console.log('JaderBot - Autenticado');
  });

  client.on('auth_failure', function () {
    socket.emit('message', 'JaderBot - Falha na autenticação, reiniciando...');
    console.error('JaderBot - Falha na autenticação');
  });

  client.on('change_state', state => {
    console.log('JaderBot Status de conexão: ', state);
  });

  client.on('disconnected', (reason) => {
    socket.emit('message', 'JaderBot - Cliente desconectado!');
    console.log('© JaderBot - Cliente desconectado', reason);
    client.initialize();
  });
});


client.on('message', async msg => {

  const mediaPath = MessageMedia.fromFilePath('./ogg/nao_abre.ogg');
  const mediaPath1 = MessageMedia.fromFilePath('./img/sistemas.png');
  const mediaPath2 = MessageMedia.fromFilePath('./img/internet.jpeg');
  const mediaPath3 = MessageMedia.fromFilePath('./img/testar.png');
  const button = new Buttons('Button body', [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }], 'title', 'footer');

  //********************** Menu Inicial *******************************************//
  if (msg.body === 'oi' || msg.body === 'Oi' || msg.body === 'olá' || msg.body === 'Olá' || msg.body === 'Ola' || msg.body === 'ola' || msg.body === 'menu' || msg.body === 'Menu' || msg.body === 'MENU' || msg.body === 'Inicio') {
    let sections = [{ title: 'Escolha uma das opções abaixo!', rows: [{ title: 'IPTV', description: '' }, { title: 'Sistemas ou Lojas Virtuais', description: '' }, { title: 'Falar com o atendente', description: '' }] }];
    let list = new List('Clique no botão abaixo:', 'Opções', sections, 'Olá, Eu sou Jáder Oliveira. \n\nO atendimento é iniciado virtualmente.\n', '© Jáder desenvolvedor');
    client.sendMessage(msg.from, list);
    //***************************Menu de Iptv********************************
  } else if (msg.body === 'iptv' || msg.body === 'Iptv' || msg.body === 'IPTV') {
    let sections = [{ title: 'Escolha uma das opções abaixo!', rows: [{ title: 'Informações', description: '' }, { title: 'Testar', description: '' }, { title: 'Assinar', description: '' }, { title: 'Renovar', description: '' }, { title: 'Suporte', description: '' }] }];
    let list = new List('e escolha uma das opções:', 'Opções', sections, '*Você escolheu IPTV.* \n\nClique no botão de opções\n', '© Jáder desenvolvedor');
    client.sendMessage(msg.from, list);
  }
  //*****Informações*****//
  if (msg.body === 'Informações') {
    client.sendMessage(msg.from, 'Um único aplicativo instalado na sua smart tv, tvbox, celular ou computador, e você tem acesso o *mês inteiro* a mais de 35 mil conteúdos, por *APENAS R$30,00!*');
    client.sendMessage(msg.from, '\nUse Inteiramente Grátis por um período de 4 horas agora mesmo!\n\nDigite a palavra *Testar*');
  }
  //*****fim de informações*****//
  //*****inicio de teste ou assinatura*****//
  //testar
  if (msg.body.includes('Testar')) {
    client.sendMessage(msg.from, 'Blz, mas antes de gerar o teste, preciso ver como está a qualidade de conexão com sua internet. \n\nNo seu celular, baixe o aplicativo *Brasil banda larga*, instale, depois de dar todas as permissões, você clica em Iniciar, tira um print do resultado e manda pra mim.');
  }//assinar
  if (msg.body.includes('Assinar')) {
    client.sendMessage(msg.from, 'Legal 😁!\nPra eu conseguir efetivar sua conta, preciso que você faça um PIX com o valor combinado para: \n\n*pixparajader@gmail.com* \n\nou \n\n*88988420622* \n\nEm seguida você me envia o comprovante e já já libero o seu usuário!');
  }//renovar
  if (msg.body.includes('Renovar')) {
    client.sendMessage(msg.from, 'Opa, beleza!\nManda pra mim ai por favor, seu usuário, dai você faz um pix para:\n\n*88988420622*\n\nou\n\n*pixparajader@gmail.com*\n\nDepois você me envia o comprovante por aqui e já já eu renovo seu acesso! 😊');
  }//***fim de teste ou assinatura***//

  //*****suporte*****//
  else if (msg.body.includes('Suporte') || msg.body.includes('suporte') || msg.body.includes('SUPORTE')) {
    let sections = [{ title: 'Escolha uma das opções abaixo!', rows: [{ title: 'Travando', description: '' }, { title: 'Esqueci meu usuário', description: '' }, { title: 'Não Abre', description: '' }] }];
    let list = new List('Escolha uma opção clicando no botão abaixo:', 'Opções', sections, '*Suporte Técnico - Vamos lá.* \n\nMe diga o que está acontecendo?\n', '© Jáder desenvolvedor');
    client.sendMessage(msg.from, list);
  }
  //Travando
  if (msg.body.includes('Travando')) {
    client.sendMessage(msg.from, 'Puxa, que chato! 😢 \nVamos tentar o seguinte procedimento:\n\nDesligue o roteador, tvbox e televisão da tomada (Desligue tudo), espere 1 minuto, em seguida ligue o roteador, espere a internet estabilizar, depois ligue a tv ou o tvbox.\n\nTenta esse procedimento e depois volta aqui e me informa se DEU CERTO ou NÂO DEU CERTO.');
  }
  //Esqueci senha
  if (msg.body.includes('Esqueci meu usuário')) {
    client.sendMessage(msg.from, 'Ah, tranquilo, já já te passo seus dados, blz?\nSe eu demorar muito pra responder, me chama aqui pra eu não esquecer!');
  }
  //Não abre
  if (msg.body.includes('Não Abre')) {
    client.sendMessage(msg.from, mediaPath, { sendAudioAsVoice: true });
  }
  //*****fim de suporte*****

  //**************Inicio do menu sistemas**************//
  if (msg.body.includes('Sistemas ou Lojas Virtuais')) {
    let sections = [{title: 'Escolha uma das opções abaixo!', rows: [{title: 'Loja Virtual', description: ''}, {title: 'Site', description: ''}, {title: 'Sistema', description: ''}, {title: 'Suporte', description: ''}]}]
    let list = new List('Escolha uma opção clicando no botão abaixo:', 'Opções', sections, '*Sistemas ou Lojas Virtuais* \n\nSobre o que você deseja falar?\n', '© Jáder desenvolvedor');
    client.sendMessage(msg.from, list);
  }
  if (msg.body === 'Sistema'){
    client.sendMessage(msg.from, 'Nós temos um sistema de Ordens de serviços e vendas chamado SysControl, caso queira um sistema personalizado, posso fazer um orçamento pra você.');
    client.sendMessage(msg.from, '\nAguarde um momento enquanto transfiro para um humano e ele lhe passará maiores informações! 😁');
  }
  if (msg.body === 'Loja Virtual'){
    client.sendMessage(msg.from, 'A melhor forma de automatizar sua empresa e alavancar suas vendas, com uma loja virtual, seu cliente pode efetuar a compra e o pagamento direto pela internet e depoisapenas passar para buscar a encomenda, ou, caso você trabalhe com delivery, você poderá apenas fazer a entrega!');
    client.sendMessage(msg.from, '\nAguarde um momento enquanto transfiro para um humano e ele irá lhe passar maiores informações! 😁');
  }
  if (msg.body === 'Site'){
    client.sendMessage(msg.from, 'Com um site, a sua empresa ficará disponível para os seus clientes, online 24hs por dia, 7 dias por semana!\nAssim seu cliente poderá visualizar seu catálogo de produtos ou serviços sempre que precisar');
    client.sendMessage(msg.from, '\nAguarde um momento enquanto transfiro para um humano e ele lhe passará maiores informações! 😁');
  }//menu suporte e menu falar com atendente
  if (msg.body === 'Suporte' || msg.body === 'Falar com o atendente'){
    client.sendMessage(msg.from, 'Vou lhe encaminhar a um humano, mas seria bom se você pudesse ir adiantando qual é o problema, pode ser?');
    client.sendMessage(msg.from, '\nAguarde só um momento! 😁');
  }
  //******************fim do menu sistemas */
  

});



server.listen(port, function () {
  console.log('App running on *: ' + port);
});
