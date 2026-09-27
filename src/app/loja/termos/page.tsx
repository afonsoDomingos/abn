import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Termos e Condições da Loja Digital ABN',
  description: 'Termos e Condições da Loja Digital ABN - Comércio electrónico de produtos, serviços, formações e eventos.',
};

export default function LojaTermos() {
  return (
    <>
      <Navbar />
      <main className={styles.termsPage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1>Termos e Condições da Loja Digital ABN</h1>
            <p className={styles.subtitle}>
              Estes Termos regem o uso da Loja Digital ABN e aplicam-se sem prejuízo da Lei n.º 3/2017, de 9 de Janeiro (Lei de Transacções Electrónicas), e da Lei n.º 22/2009, de 28 de Setembro (Lei de Defesa do Consumidor). Os valores de comissões e preços constam da Tabela de Preços em vigor.
            </p>
          </header>

          <article className={styles.content}>
            <section className={styles.section}>
              <h2>1. Identificação, definições e aceitação</h2>
              <div className={styles.clause}>
                <h3>1.1.</h3>
                <p>
                  A Loja Digital ABN ("Loja") é uma plataforma de comércio electrónico disponível em <a href="https://www.abnafrobiznetwork.com/loja" target="_blank" rel="noopener noreferrer">www.abnafrobiznetwork.com/loja</a>, gerida pela AFROBIZ NETWORK ABN, SU, LDA ("ABN"), sociedade unipessoal constituída e registada em Moçambique a 2 de Junho de 2026, com sede em Moçambique, Cidade de Maputo, Distrito de Kamubukwana, Bairro de Magoanine-A, Av. Maria de Lurdes Mutola, Q.60, Casa nº 01, NUIT 402200456, matriculada na Conservatória das Entidades Legais sob o n.º 105074664, e representada pelo seu administrador, Culpa Francisco Xavier Lissamo.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>1.2.</h3>
                <p>
                  Para efeitos destes Termos:
                </p>
                <ul>
                  <li><strong>Utilizador:</strong> qualquer pessoa que acede à Loja.</li>
                  <li><strong>Vendedor:</strong> empreendedor, profissional independente, startup ou empresa que abre uma loja e publica produtos ou serviços.</li>
                  <li><strong>Comprador:</strong> pessoa singular ou colectiva que adquire um produto ou serviço através da Loja.</li>
                  <li><strong>Item:</strong> qualquer produto físico, produto digital, serviço, formação ou evento publicado na Loja.</li>
                  <li><strong>Pedido:</strong> compra de um ou mais Itens confirmada e paga através da Loja.</li>
                  <li><strong>Tabela de Preços:</strong> documento publicado pela ABN com os planos, comissões e preços de visibilidade em vigor.</li>
                </ul>
              </div>
              <div className={styles.clause}>
                <h3>1.3.</h3>
                <p>
                  Ao criar uma conta, publicar um Item ou fazer um Pedido, o Utilizador declara que leu e aceita estes Termos. Quem não os aceitar não deve usar a Loja.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>1.4.</h3>
                <p>
                  A ABN actua como intermediária entre Vendedores e Compradores. O contrato de compra e venda de cada Item é celebrado directamente entre o Vendedor e o Comprador, salvo quando a própria ABN é a vendedora.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>1.5.</h3>
                <p>
                  A Loja é operada a partir de Moçambique e está aberta a Utilizadores de outros países. Os Utilizadores fora de Moçambique beneficiam também das normas imperativas de protecção do consumidor do seu país de residência.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2>2. Conta e registo</h2>
              <div className={styles.clause}>
                <h3>2.1.</h3>
                <p>
                  Podem registar-se na Loja pessoas com 18 anos ou mais e empresas legalmente constituídas, representadas por quem tenha poderes para as obrigar.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>2.2.</h3>
                <p>
                  O Vendedor escolhe o perfil de Empreendedor ou Empresa e compromete-se a fornecer dados verdadeiros, completos e actualizados, incluindo nome ou denominação, NUIT quando aplicável, contactos, localização e conta para recebimentos.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>2.3.</h3>
                <p>
                  A ABN pode pedir documentos que confirmem a identidade ou a actividade do Vendedor, nomeadamente para atribuir o selo de vendedor verificado.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>2.4.</h3>
                <p>
                  O Utilizador é responsável pela confidencialidade da sua palavra-passe e por toda a actividade feita na sua conta. Qualquer uso não autorizado deve ser comunicado de imediato à ABN.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>2.5.</h3>
                <p>
                  Cada pessoa ou empresa pode ter apenas uma conta de Vendedor, salvo autorização expressa da ABN.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2>3. Obrigações do Vendedor e Itens proibidos</h2>
              <div className={styles.clause}>
                <h3>3.1.</h3>
                <p>
                  O Vendedor compromete-se a:
                </p>
                <ul>
                  <li>publicar descrições, fotografias, preços e condições de entrega verdadeiros e actualizados;</li>
                  <li>ter o Item disponível ou indicar claramente o prazo de produção ou prestação;</li>
                  <li>cumprir os Pedidos confirmados nos prazos anunciados;</li>
                  <li>responder às mensagens dos Compradores num prazo razoável, preferencialmente até 48 horas;</li>
                  <li>cumprir a legislação aplicável à sua actividade, incluindo obrigações fiscais, licenças e garantias legais dos produtos.</li>
                </ul>
              </div>
              <div className={styles.clause}>
                <h3>3.2.</h3>
                <p>
                  O Vendedor é o único responsável pela qualidade, segurança, legalidade e conformidade dos Itens que vende.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>3.3.</h3>
                <p>
                  É proibido publicar ou vender na Loja:
                </p>
                <ul>
                  <li>produtos ilegais, roubados, contrafeitos ou que violem direitos de terceiros;</li>
                  <li>armas, munições, explosivos e drogas;</li>
                  <li>medicamentos sujeitos a receita médica;</li>
                  <li>bebidas alcoólicas e tabaco, salvo autorização expressa da ABN e cumprimento da lei;</li>
                  <li>conteúdo sexual, discriminatório, violento ou que incite ao ódio;</li>
                  <li>esquemas de pirâmide, promessas de rendimento garantido ou serviços financeiros não licenciados;</li>
                  <li>qualquer Item cuja venda seja proibida pela lei do país do Vendedor ou do Comprador.</li>
                </ul>
              </div>
              <div className={styles.clause}>
                <h3>3.4.</h3>
                <p>
                  A ABN pode recusar, retirar ou suspender qualquer Item que viole estes Termos, sem aviso prévio quando o caso o justifique.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2>4. Preços, comissões e pagamentos</h2>
              <div className={styles.clause}>
                <h3>4.1.</h3>
                <p>
                  Abrir uma loja na ABN é gratuito. O Vendedor define livremente os preços dos seus Itens, que devem incluir todos os impostos aplicáveis e indicar claramente os custos de entrega.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>4.2.</h3>
                <p>
                  Sobre cada Pedido concluído, a ABN cobra ao Vendedor uma comissão, calculada sobre o valor do Item sem custos de entrega, conforme o plano e a categoria indicados na Tabela de Preços em vigor.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>4.3.</h3>
                <p>
                  Os Pedidos são pagos pelo Comprador à ABN, através dos meios disponíveis na Loja: M-Pesa, e-Mola, transferência bancária e outros canais que a ABN venha a disponibilizar.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>4.4.</h3>
                <p>
                  A ABN transfere ao Vendedor o valor do Pedido, deduzida a comissão, no prazo de até 7 (sete) dias úteis após a confirmação da entrega ou da prestação do serviço, para a conta indicada pelo Vendedor.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>4.5.</h3>
                <p>
                  A ABN pode reter o repasse enquanto decorrer uma reclamação ou pedido de reembolso sobre esse Pedido.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>4.6.</h3>
                <p>
                  Pagamentos combinados e feitos directamente entre Vendedor e Comprador, fora da Loja, não são cobertos por estes Termos nem pela protecção da ABN.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>4.7.</h3>
                <p>
                  A ABN emite ao Vendedor documento de quitação das comissões cobradas. A emissão de factura ou recibo ao Comprador pela venda do Item é responsabilidade do Vendedor.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>4.8.</h3>
                <p>
                  Antes de confirmar um Pedido, a Loja mostra ao Comprador um resumo com a identificação do Vendedor, a descrição do Item, o preço total com impostos, os custos de entrega, o meio de pagamento, o prazo de entrega e a política de devolução, permitindo rever e corrigir qualquer erro.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>4.9.</h3>
                <p>
                  Após o pagamento, a Loja envia de imediato ao Comprador e ao Vendedor uma confirmação do Pedido, que pode ser guardada ou impressa como registo da transacção.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>4.10.</h3>
                <p>
                  Se o Comprador cometer um erro ao introduzir o Pedido, pode anulá-lo informando a ABN nas 24 horas seguintes a ter tomado conhecimento do erro, desde que ainda não tenha recebido nem usado o Item.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2>5. Entregas, cancelamentos, devoluções e reembolsos</h2>
              <div className={styles.clause}>
                <h3>5.1.</h3>
                <p>
                  A entrega de produtos físicos é feita pelo Vendedor, ou por parceiro por ele escolhido, no prazo indicado no Item. Se nenhum prazo for indicado, a entrega é feita até 30 (trinta) dias a contar do dia seguinte ao Pedido. O risco de perda ou dano durante o transporte é do Vendedor até à entrega ao Comprador.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>5.2.</h3>
                <p>
                  Produtos digitais são disponibilizados por download ou envio electrónico após a confirmação do pagamento. Serviços, formações e eventos são prestados nas datas e formatos anunciados.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>5.3.</h3>
                <p>
                  Se o Item não for entregue no prazo indicado ou, na falta deste, em 30 dias, o Comprador pode cancelar o Pedido por escrito através da Loja, com aviso prévio de 7 (sete) dias, e é reembolsado de tudo o que pagou.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>5.4.</h3>
                <p>
                  Se o Item ficar indisponível depois de pago, o Vendedor deve informar o Comprador através da Loja e o Comprador é reembolsado de tudo o que pagou.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>5.5. Direito de desistência.</h3>
                <p>
                  O Comprador pode desistir da compra, sem indicar motivo e suportando apenas o custo de devolução do bem:
                </p>
                <ul>
                  <li>no caso de produtos, no prazo de 7 (sete) dias após os receber;</li>
                  <li>no caso de serviços, formações e eventos, no prazo de 7 (sete) dias após a confirmação do Pedido.</li>
                </ul>
              </div>
              <div className={styles.clause}>
                <h3>5.6.</h3>
                <p>
                  O direito de desistência não se aplica a:
                </p>
                <ul>
                  <li>serviços, formações ou eventos que tenham começado, com o acordo do Comprador, antes de terminar o prazo de 7 dias;</li>
                  <li>produtos feitos por medida ou personalizados a pedido do Comprador;</li>
                  <li>produtos que se deteriorem ou percam validade rapidamente;</li>
                  <li>produtos digitais já descarregados ou abertos, que pela sua natureza não podem ser devolvidos.</li>
                </ul>
              </div>
              <div className={styles.clause}>
                <h3>5.7.</h3>
                <p>
                  Independentemente do direito de desistência, o Comprador tem direito a reembolso, troca ou reparação quando o Item entregue for diferente da descrição ou tiver defeito, nos termos da Lei de Defesa do Consumidor. O pedido é feito através da Loja, com fotografias ou outra prova quando aplicável.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>5.8.</h3>
                <p>
                  Os produtos devolvidos devem estar no estado em que foram recebidos, salvo defeito.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>5.9.</h3>
                <p>
                  A ABN devolve ao Comprador os valores devidos pelo mesmo meio de pagamento no prazo de até 10 (dez) dias úteis após a aprovação do reembolso e, em qualquer caso, nunca depois de 30 (trinta) dias após o cancelamento ou a desistência. Se o repasse ao Vendedor já tiver sido feito, a ABN pode descontar o valor em repasses futuros ou exigi-lo ao Vendedor.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2>6. Comprador, avaliações e litígios</h2>
              <div className={styles.clause}>
                <h3>6.1.</h3>
                <p>
                  O Comprador compromete-se a fornecer dados de entrega correctos, pagar os Pedidos através da Loja e confirmar a recepção dos Itens quando os receber.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>6.2.</h3>
                <p>
                  Após cada Pedido, o Comprador pode avaliar o Vendedor. As avaliações devem ser honestas, relacionadas com o Pedido e sem linguagem ofensiva. A ABN pode retirar avaliações falsas, abusivas ou pagas.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>6.3.</h3>
                <p>
                  Em caso de desacordo, Vendedor e Comprador devem primeiro tentar resolvê-lo entre si, através das mensagens da Loja.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>6.4.</h3>
                <p>
                  Se não houver acordo em 5 (cinco) dias úteis, qualquer das partes pode pedir a mediação da ABN. A ABN analisa as provas apresentadas e decide sobre o reembolso ou o repasse do valor em causa. Esta decisão não impede as partes de recorrer às vias legais.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2>7. Planos, visibilidade paga e propriedade intelectual</h2>
              <div className={styles.clause}>
                <h3>7.1.</h3>
                <p>
                  A ABN pode oferecer planos pagos para Vendedores e serviços de visibilidade, como destaques na página inicial, posição de topo em categorias e publicações nas redes sociais da ABN, aos preços da Tabela de Preços em vigor.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>7.2.</h3>
                <p>
                  Os planos mensais ou anuais renovam-se automaticamente, salvo cancelamento pelo Vendedor antes da data de renovação. Serviços de visibilidade já iniciados não são reembolsáveis.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>7.3.</h3>
                <p>
                  A ABN reserva-se o direito de recusar um destaque ou publicação cujo conteúdo não respeite estes Termos ou a imagem da ABN, devolvendo o valor pago.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>7.4.</h3>
                <p>
                  O Vendedor mantém todos os direitos sobre as suas marcas, fotografias e textos, e garante que tem autorização para usar tudo o que publica. Ao publicar, autoriza a ABN a usar esse conteúdo, sem custos, para mostrar e promover os seus Itens na Loja, nas redes sociais e em materiais da ABN.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>7.5.</h3>
                <p>
                  A marca ABN, o logótipo, o selo de vendedor verificado e o design da Loja pertencem à ABN e só podem ser usados com a sua autorização.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2>8. Dados pessoais, responsabilidade e suspensão</h2>
              <div className={styles.clause}>
                <h3>8.1.</h3>
                <p>
                  A ABN recolhe e trata os dados pessoais dos Utilizadores (nome, contactos, endereço de entrega, dados do negócio e histórico de Pedidos) apenas para gerir contas, Pedidos, pagamentos, repasses, apoio e comunicações da Loja, e protege-os contra perda, acesso não autorizado, alteração ou divulgação.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>8.1.1.</h3>
                <p>
                  A ABN não vende os dados pessoais dos Utilizadores e só os partilha com terceiros quando necessário para executar o Pedido (Vendedor, operadoras de pagamento, transportadores), quando a lei o exija ou por decisão judicial.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>8.1.2.</h3>
                <p>
                  Qualquer Utilizador pode, a qualquer momento, saber que dados a ABN tem sobre si, pedir a sua rectificação ou actualização, opor-se ao seu uso ou pedir a sua eliminação, contactando o responsável pela protecção de dados da ABN através dos contactos da cláusula 9.3.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>8.1.3.</h3>
                <p>
                  A ABN só envia mensagens promocionais por email, SMS ou WhatsApp a quem tenha dado o seu consentimento ou seja já cliente da Loja, e cada mensagem inclui uma forma simples e gratuita de deixar de as receber.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>8.2.</h3>
                <p>
                  O Vendedor recebe os dados de contacto e entrega do Comprador apenas para cumprir o Pedido, e não os pode usar para outros fins nem partilhar com terceiros.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>8.3.</h3>
                <p>
                  A ABN não é vendedora dos Itens de terceiros e não responde pela sua qualidade, segurança ou legalidade, nem por danos causados pelo Vendedor ou pelo Comprador, sem prejuízo da mediação prevista na cláusula 6.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>8.4.</h3>
                <p>
                  A ABN procura manter a Loja disponível e segura, mas não garante funcionamento sem interrupções. Não responde por falhas causadas por terceiros, operadoras de pagamento ou telecomunicações, ou por motivos de força maior.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>8.5.</h3>
                <p>
                  A ABN pode suspender ou encerrar a conta de um Utilizador que viole estes Termos, pratique fraude, acumule reclamações justificadas ou prejudique a imagem da Loja. Sempre que possível, avisa antes e dá oportunidade de resposta. Os valores devidos ao Vendedor por Pedidos regulares são pagos, deduzidas as quantias em disputa.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>8.6.</h3>
                <p>
                  O Utilizador pode encerrar a sua conta a qualquer momento, depois de concluídos os Pedidos em curso.
                </p>
              </div>
            </section>

            <section className={styles.section}>
              <h2>9. Alterações, lei aplicável e contactos</h2>
              <div className={styles.clause}>
                <h3>9.1.</h3>
                <p>
                  A ABN pode alterar estes Termos e a Tabela de Preços. As alterações são publicadas na Loja e comunicadas aos Vendedores com pelo menos 15 (quinze) dias de antecedência, não se aplicando a Pedidos já feitos.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>9.2.</h3>
                <p>
                  Estes Termos regem-se pela lei da República de Moçambique, nomeadamente a Lei n.º 3/2017, de 9 de Janeiro, a Lei n.º 22/2009, de 28 de Setembro, e o seu Regulamento. Qualquer litígio não resolvido por acordo ou mediação é submetido ao foro da Cidade de Maputo, sem prejuízo dos direitos do consumidor previstos na lei do seu país de residência.
                </p>
              </div>
              <div className={styles.clause}>
                <h3>9.3. Contactos da Loja Digital ABN</h3>
                <div className={styles.contactInfo}>
                  <p><strong>Empresa:</strong> AFROBIZ NETWORK ABN, SU, LDA</p>
                  <p><strong>Tipo:</strong> Sociedade Unipessoal, Limitada</p>
                  <p><strong>NUIT:</strong> 402200456</p>
                  <p><strong>N.º da entidade legal:</strong> 105074664</p>
                  <p><strong>Data de constituição:</strong> 02 de Junho de 2026</p>
                  <p><strong>Administrador:</strong> Culpa Francisco Xavier Lissamo</p>
                  <p><strong>Endereço:</strong> Moçambique, Cidade de Maputo, Distrito de Kamubukwana, Bairro de Magoanine-A, Av. Maria de Lurdes Mutola, Q.60, Casa nº 01</p>
                  <p><strong>Site:</strong> <a href="https://www.abnafrobiznetwork.com/loja" target="_blank" rel="noopener noreferrer">www.abnafrobiznetwork.com/loja</a></p>
                  <p><strong>WhatsApp:</strong> +258 84 577 3974</p>
                  <p><strong>Email:</strong> <a href="mailto:info@abnafrobiznetwork.com">info@abnafrobiznetwork.com</a></p>
                </div>
              </div>
              <div className={styles.clause}>
                <h3>9.4.</h3>
                <p>
                  Estes Termos estão sempre disponíveis na Loja e podem ser guardados ou impressos pelo Utilizador. A versão aplicável a cada Pedido é a que estava em vigor na data em que foi feito.
                </p>
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
