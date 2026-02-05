import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuditProducerService } from '../queues/audit.producer.service';
import {
  UsuarioCreatedEvent,
  UsuarioUpdatedEvent,
  UsuarioSoftDeletedEvent,
  UsuarioRestoredEvent,
  PasswordChangedEvent,
  UsuarioAddedToEmpresaEvent,
  UsuarioRemovedFromEmpresaEvent,
} from '../../../usuarios/domain/events/usuario.events';
import {
  EmpresaCreatedEvent,
  EmpresaUpdatedEvent,
  EmpresaActivatedEvent,
  EmpresaDeactivatedEvent,
  EmpresaSoftDeletedEvent,
  EmpresaRestoredEvent,
} from '../../../empresas/domain/events/empresa.events';

@Injectable()
export class DomainEventAuditHandler {
  private readonly logger = new Logger(DomainEventAuditHandler.name);

  constructor(private readonly auditProducer: AuditProducerService) {}

  @OnEvent('usuario.created')
  async handleUsuarioCreated(event: UsuarioCreatedEvent) {
    this.logger.debug(`Usuario criado: ${event.usuarioId}`);
    await this.auditProducer.log({
      acao: 'CRIAR',
      recurso: 'USUARIO',
      recursoId: event.usuarioId.toString(),
      detalhes: {
        evento: event.getEventName(),
        email: event.email,
        empresaId: event.empresaId,
      },
    });
  }

  @OnEvent('usuario.updated')
  async handleUsuarioUpdated(event: UsuarioUpdatedEvent) {
    this.logger.debug(`Usuario atualizado: ${event.usuarioId}`);
    await this.auditProducer.log({
      acao: 'ATUALIZAR',
      recurso: 'USUARIO',
      recursoId: event.usuarioId.toString(),
      detalhes: {
        evento: event.getEventName(),
        email: event.email,
        alteracoes: Object.keys(event.changes),
      },
    });
  }

  @OnEvent('usuario.soft_deleted')
  async handleUsuarioSoftDeleted(event: UsuarioSoftDeletedEvent) {
    this.logger.debug(`Usuario deletado (soft): ${event.usuarioId}`);
    await this.auditProducer.log({
      acao: 'DELETAR',
      recurso: 'USUARIO',
      recursoId: event.usuarioId.toString(),
      detalhes: {
        evento: event.getEventName(),
        email: event.email,
        deletedAt: event.deletedAt,
      },
    });
  }

  @OnEvent('usuario.restored')
  async handleUsuarioRestored(event: UsuarioRestoredEvent) {
    this.logger.debug(`Usuario restaurado: ${event.usuarioId}`);
    await this.auditProducer.log({
      acao: 'RESTAURAR',
      recurso: 'USUARIO',
      recursoId: event.usuarioId.toString(),
      detalhes: {
        evento: event.getEventName(),
        email: event.email,
        restoredAt: event.restoredAt,
      },
    });
  }

  @OnEvent('usuario.password_changed')
  async handlePasswordChanged(event: PasswordChangedEvent) {
    this.logger.debug(`Senha alterada: ${event.usuarioId}`);
    await this.auditProducer.log({
      acao: 'ALTERAR_SENHA',
      recurso: 'USUARIO',
      recursoId: event.usuarioId.toString(),
      detalhes: {
        evento: event.getEventName(),
        email: event.email,
        changedAt: event.changedAt,
      },
    });
  }

  @OnEvent('usuario.added_to_empresa')
  async handleUsuarioAddedToEmpresa(event: UsuarioAddedToEmpresaEvent) {
    this.logger.debug(
      `Usuario adicionado à empresa: ${event.usuarioId} -> ${event.empresaId}`,
    );
    await this.auditProducer.log({
      acao: 'ADICIONAR_A_EMPRESA',
      recurso: 'USUARIO',
      recursoId: event.usuarioId.toString(),
      detalhes: {
        evento: event.getEventName(),
        empresaId: event.empresaId,
        perfilIds: event.perfilIds,
      },
    });
  }

  @OnEvent('usuario.removed_from_empresa')
  async handleUsuarioRemovedFromEmpresa(event: UsuarioRemovedFromEmpresaEvent) {
    this.logger.debug(
      `Usuario removido da empresa: ${event.usuarioId} -> ${event.empresaId}`,
    );
    await this.auditProducer.log({
      acao: 'REMOVER_DA_EMPRESA',
      recurso: 'USUARIO',
      recursoId: event.usuarioId.toString(),
      detalhes: {
        evento: event.getEventName(),
        empresaId: event.empresaId,
      },
    });
  }

  @OnEvent('empresa.created')
  async handleEmpresaCreated(event: EmpresaCreatedEvent) {
    this.logger.debug(`Empresa criada: ${event.empresaId}`);
    await this.auditProducer.log({
      acao: 'CRIAR',
      recurso: 'EMPRESA',
      recursoId: event.empresaId.toString(),
      detalhes: {
        evento: event.getEventName(),
        nome: event.nome,
        cnpj: event.cnpj,
      },
    });
  }

  @OnEvent('empresa.updated')
  async handleEmpresaUpdated(event: EmpresaUpdatedEvent) {
    this.logger.debug(`Empresa atualizada: ${event.empresaId}`);
    await this.auditProducer.log({
      acao: 'ATUALIZAR',
      recurso: 'EMPRESA',
      recursoId: event.empresaId.toString(),
      detalhes: {
        evento: event.getEventName(),
        nome: event.nome,
        alteracoes: Object.keys(event.changes),
      },
    });
  }

  @OnEvent('empresa.activated')
  async handleEmpresaActivated(event: EmpresaActivatedEvent) {
    this.logger.debug(`Empresa ativada: ${event.empresaId}`);
    await this.auditProducer.log({
      acao: 'ATIVAR',
      recurso: 'EMPRESA',
      recursoId: event.empresaId.toString(),
      detalhes: {
        evento: event.getEventName(),
        nome: event.nome,
        activatedAt: event.activatedAt,
      },
    });
  }

  @OnEvent('empresa.deactivated')
  async handleEmpresaDeactivated(event: EmpresaDeactivatedEvent) {
    this.logger.debug(`Empresa desativada: ${event.empresaId}`);
    await this.auditProducer.log({
      acao: 'DESATIVAR',
      recurso: 'EMPRESA',
      recursoId: event.empresaId.toString(),
      detalhes: {
        evento: event.getEventName(),
        nome: event.nome,
        deactivatedAt: event.deactivatedAt,
      },
    });
  }

  @OnEvent('empresa.soft_deleted')
  async handleEmpresaSoftDeleted(event: EmpresaSoftDeletedEvent) {
    this.logger.debug(`Empresa deletada (soft): ${event.empresaId}`);
    await this.auditProducer.log({
      acao: 'DELETAR',
      recurso: 'EMPRESA',
      recursoId: event.empresaId.toString(),
      detalhes: {
        evento: event.getEventName(),
        nome: event.nome,
        deletedAt: event.deletedAt,
      },
    });
  }

  @OnEvent('empresa.restored')
  async handleEmpresaRestored(event: EmpresaRestoredEvent) {
    this.logger.debug(`Empresa restaurada: ${event.empresaId}`);
    await this.auditProducer.log({
      acao: 'RESTAURAR',
      recurso: 'EMPRESA',
      recursoId: event.empresaId.toString(),
      detalhes: {
        evento: event.getEventName(),
        nome: event.nome,
        restoredAt: event.restoredAt,
      },
    });
  }
}
