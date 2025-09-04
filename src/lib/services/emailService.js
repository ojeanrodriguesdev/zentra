/**
 * Serviço de Email Simulado para Desenvolvimento
 * Em produção, integrar com SendGrid, AWS SES, ou similar
 */

/**
 * Enviar convite por email
 */
export async function sendInviteEmail({ email, projectName, inviterName, role, inviteLink }) {
  try {
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const roleText = role === 'admin' ? 'Administrador' : 'Colaborador';
    
    const emailContent = {
      to: email,
      subject: `🎉 Você foi convidado para o projeto "${projectName}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Zentra</h1>
            <p style="color: #E0E7FF; margin: 10px 0 0 0; font-size: 16px;">Sistema de Gestão de Projetos</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1F2937; margin: 0 0 20px 0; font-size: 24px;">🎉 Você foi convidado!</h2>
            
            <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              <strong>${inviterName}</strong> convidou você para participar do projeto 
              <strong>"${projectName}"</strong> como <strong>${roleText}</strong>.
            </p>
            
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 18px;">📋 O que você pode fazer:</h3>
              <ul style="color: #6B7280; margin: 0; padding-left: 20px;">
                ${role === 'admin' ? `
                  <li>Gerenciar tarefas e membros</li>
                  <li>Editar e criar tarefas</li>
                  <li>Comentar em tarefas</li>
                  <li>Marcar tarefas como concluídas</li>
                ` : `
                  <li>Visualizar tarefas atribuídas</li>
                  <li>Comentar em tarefas</li>
                  <li>Alterar status de tarefas (pendente/em progresso)</li>
                `}
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" 
                 style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        font-size: 16px;
                        display: inline-block;">
                🚀 Aceitar Convite
              </a>
            </div>
            
            <p style="color: #9CA3AF; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
              Este link expira em 7 dias. Se você não tem uma conta no Zentra, 
              será redirecionado para criar uma conta primeiro.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #9CA3AF; font-size: 12px;">
            <p>Este é um email automático do sistema Zentra. Não responda a este email.</p>
            <p>Se você não esperava este convite, pode ignorar este email.</p>
          </div>
        </div>
      `,
      text: `
        Você foi convidado para o projeto "${projectName}"
        
        ${inviterName} convidou você para participar do projeto "${projectName}" como ${roleText}.
        
        Clique no link abaixo para aceitar o convite:
        ${inviteLink}
        
        Este link expira em 7 dias.
      `
    };
    
    // Em desenvolvimento, apenas logar o email
    console.log('📧 EMAIL SIMULADO ENVIADO:');
    console.log('=====================================');
    console.log('Para:', email);
    console.log('Assunto:', emailContent.subject);
    console.log('Link de convite:', inviteLink);
    console.log('=====================================');
    
    // Em produção, aqui seria a integração real com o serviço de email
    // await sendGrid.send(emailContent);
    // ou
    // await awsSES.send(emailContent);
    
    return {
      success: true,
      messageId: `dev-${Date.now()}`,
      email: email,
      inviteLink: inviteLink
    };
    
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Falha ao enviar convite por email');
  }
}

/**
 * Enviar notificação de convite aceito
 */
export async function sendInviteAcceptedNotification({ inviterEmail, inviterName, projectName, newMemberName, role }) {
  try {
    const roleText = role === 'admin' ? 'Administrador' : 'Colaborador';
    
    const emailContent = {
      to: inviterEmail,
      subject: `✅ ${newMemberName} aceitou seu convite para "${projectName}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">✅ Convite Aceito!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1F2937; margin: 0 0 20px 0; font-size: 24px;">🎉 Boa notícia!</h2>
            
            <p style="color: #6B7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              <strong>${newMemberName}</strong> aceitou seu convite e agora é um <strong>${roleText}</strong> 
              no projeto <strong>"${projectName}"</strong>.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/projects" 
                 style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        font-size: 16px;
                        display: inline-block;">
                🚀 Ver Projeto
              </a>
            </div>
          </div>
        </div>
      `
    };
    
    console.log('📧 NOTIFICAÇÃO SIMULADA ENVIADA:');
    console.log('=====================================');
    console.log('Para:', inviterEmail);
    console.log('Assunto:', emailContent.subject);
    console.log('=====================================');
    
    return {
      success: true,
      messageId: `dev-notification-${Date.now()}`
    };
    
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    // Não falhar o processo principal se a notificação falhar
    return { success: false, error: error.message };
  }
}
