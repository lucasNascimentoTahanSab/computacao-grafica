/**
 * Classe responsável pelo preenchimento dinânico de dados
 * pertinentes a cada um dos formulários presentes na plataforma.
 */
import FormularioTransformacoesGeometricas from './formularioTransformacoesGeometricas.js';
import FormularioDesenharReta from './formularioDesenharReta.js';
import FormularioDesenharCircunferencia from './formularioDesenharCircunferencia.js';
import FormularioRecorte from './formularioRecorte.js';

export default class FormularioController {
  _formularios

  constructor() {
    this._formularios = {
      'transformacoes-geometricas': new FormularioTransformacoesGeometricas,
      'desenhar-reta': new FormularioDesenharReta,
      'desenhar-circunferencia': new FormularioDesenharCircunferencia,
      'recortes': new FormularioRecorte
    }
  }

  preencherCamposDoFormulario(formulario, campos) {
    if (!(formulario in this._formularios)) return

    this._formularios[formulario].campos = campos
  }

  obterFormulario(formulario) {
    if (!(formulario in this._formularios)) return

    return this._formularios[formulario]
  }
}