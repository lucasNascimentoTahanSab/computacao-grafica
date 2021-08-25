import FormularioTransformacoesGeometricas from "./formularioTransformacoesGeometricas.js";
import FormularioDesenharReta from "./formularioDesenharReta.js";
import FormularioDesenharCircunferencia from "./formularioDesenharCircunferencia.js";

export default class FormularioController {
  _formularios

  constructor() {
    this._formularios = {
      'transformacoes-geometricas': new FormularioTransformacoesGeometricas,
      'desenhar-reta': new FormularioDesenharReta,
      'desenhar-circunferencia': new FormularioDesenharCircunferencia
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